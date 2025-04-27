# routes/views.py

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from django.contrib.auth import get_user_model
from .models import Route, Waypoint
from .serializers import RouteSerializer
from .permissions import IsRouteOwnerOrReadOnly, IsCollaboratorOrOwner
from .mixins import OwnerEditMixin, CollaborativeEditMixin
from django.views.generic import CreateView, ListView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from .forms import RouteCreateForm

User = get_user_model()

class RouteViewSet(OwnerEditMixin, CollaborativeEditMixin, ModelViewSet):
    queryset = Route.objects.all().prefetch_related('collaborators')
    serializer_class = RouteSerializer
    permission_classes = [IsCollaboratorOrOwner]
    
    # Versiyon çakışması için atomic transaction
    from django.db import transaction
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if 'version' not in request.data:
            raise PermissionDenied("Versiyon bilgisi gereklidir")
            
        if instance.version != int(request.data['version']):
            raise PermissionDenied("Bu kayıt başkası tarafından güncellenmiş. Lütfen yeniden deneyin.")
        
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='toggle-share', permission_classes=[IsRouteOwnerOrReadOnly])
    def toggle_share(self, request, pk=None):
        """Paylaşım durumunu değiştirme ve QR kod yönetimi"""
        route = self.get_object()
        route.is_shared = not route.is_shared
        
        if route.is_shared:
            if not route.share_token:
                route.generate_share_token()
            route.generate_qr_code()  # QR kodunu yeniden oluştur
        else:
            route.share_token = None
            route.qr_code.delete(save=False)
        
        route.save()
        return Response({
            'status': 'shared' if route.is_shared else 'private',
            'share_link': route.get_absolute_share_url(),
            'qr_code': route.qr_code.url if route.is_shared else None
        })

    @action(detail=True, methods=['get', 'post', 'delete'], url_path='collaborators', permission_classes=[IsRouteOwnerOrReadOnly])
    def manage_collaborators(self, request, pk=None):
        """İşbirlikçi yönetimi için gelişmiş metod"""
        route = self.get_object()
        
        if request.method == 'POST':
            email = request.data.get('email')
            if not email:
                return Response({"error": "Email alanı gereklidir"}, status=400)
            
            try:
                user = User.objects.get(email=email)
                if user == request.user:
                    return Response({"error": "Kendinizi işbirlikçi olarak ekleyemezsiniz"}, status=400)
                
                route.collaborators.add(user)
            except User.DoesNotExist:
                raise NotFound("Belirtilen email ile kullanıcı bulunamadı")

        elif request.method == 'DELETE':
            user_id = request.data.get('user_id')
            try:
                user = User.objects.get(id=user_id)
                route.collaborators.remove(user)
            except User.DoesNotExist:
                raise NotFound("Kullanıcı bulunamadı")

        return Response({
            'owner': route.user.email,
            'collaborators': [u.email for u in route.collaborators.all()],
            'total': route.collaborators.count()
        })
    
    @action(detail=True, methods=['get'], url_path='shared')
    def shared_route_detail(self, request, pk=None):
        """Paylaşılan rotanın detayını döndürür (QR veya token ile erişim)."""
        share_token = self.kwargs.get('share_token')
        try:
            route = Route.objects.get(share_token=share_token, is_shared=True)
        except Route.DoesNotExist:
            raise NotFound("Rota bulunamadı veya paylaşım kapalı.")
        serializer = self.get_serializer(route)
        return Response(serializer.data)

# Web UI Views
class RouteCreateView(LoginRequiredMixin, CreateView):
    model = Route
    form_class = RouteCreateForm
    template_name = 'routes/route_create.html'
    success_url = reverse_lazy('route-list')

    def form_valid(self, form):
        form.instance.user = self.request.user
        form.instance.version += 1  # Versiyon artırımı
        return super().form_valid(form)

class RouteListView(LoginRequiredMixin, ListView):
    model = Route
    template_name = 'routes/route_list.html'
    context_object_name = 'routes'
    paginate_by = 10

    def get_queryset(self):
        return Route.objects.filter(user=self.request.user).prefetch_related('waypoints')

class RouteDetailView(LoginRequiredMixin, DetailView):
    model = Route
    template_name = 'routes/route_detail.html'
    context_object_name = 'route'

    def get_queryset(self):
        return super().get_queryset().select_related('user').prefetch_related('waypoints')