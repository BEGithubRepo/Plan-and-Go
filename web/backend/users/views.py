# users/views.py

from django.utils import timezone
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView, PasswordResetView, PasswordChangeView
from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.views import View
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.http import JsonResponse
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .forms import (
    CustomUserCreationForm, 
    MobileLoginForm, 
    ProfileUpdateForm, 
    PasswordResetRequestForm)
from .serializers import (
    UserSerializer, 
    ProfileSerializer, 
    ActivitySerializer, 
    CustomTokenObtainPairSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer)
from .permissions import ActivityAccessPermission
from .models import Activity, User, Profile, PasswordResetToken


def home(request):
    return render(request, 'home.html')

# Web Register View
class WebRegisterView(View):
    form_class = CustomUserCreationForm
    template_name = 'users/auth/register.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('home')
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = self.form_class(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Hesabınız başarıyla oluşturuldu')
            return redirect('login')
        return render(request, self.template_name, {'form': form})

# Web Login View
class WebLoginView(LoginView):
    form_class = MobileLoginForm
    template_name = 'users/auth/login.html' 

    def form_valid(self, form):
        remember_me = form.cleaned_data.get('remember_me')
        if not remember_me:
            self.request.session.set_expiry(0)
            self.request.session.modified = True
        return super().form_valid(form)

# Web Logout View
class WebLogoutView(View):
    def dispatch(self, request, *args, **kwargs):
        if request.method == "GET":
            logout(request)
            return render(request, 'users/auth/logout.html')
        return super().dispatch(request, *args, **kwargs)  # POST isteğini normal işle

# API Password Reset View
class PasswordResetAPIView(SuccessMessageMixin, PasswordResetView):
    form_class = PasswordResetRequestForm
    template_name = 'users/password/password_reset.html'
    email_template_name = 'users/emails/password_reset_email.html'
    subject_template_name = 'users/emails/password_reset_subject'
    success_url = reverse_lazy('login')
    success_message = "Şifre sıfırlama talimatları e-posta adresinize gönderildi"

# API Password Change View
class PasswordChangeAPIView(SuccessMessageMixin, PasswordChangeView):
    template_name = 'users/password/password_reset_confirm.html'  # Güncellenmiş template path
    success_url = reverse_lazy('password_change_complete')
    success_message = "Şifreniz başarıyla değiştirildi"

    def form_valid(self, form):
        response = super().form_valid(form)
        if self.request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'status': 'success', 'message': self.success_message})
        return response

# API Password Reset Request Handler
class PasswordResetRequestAPIView(generics.CreateAPIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(username=serializer.validated_data['username'])
            token = PasswordResetToken.objects.create(user=user)
            
            return Response({"status": "success", "token": token.token})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API Password Reset Confirm Handler
class PasswordResetConfirmAPIView(generics.CreateAPIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            reset_token = PasswordResetToken.objects.filter(
                token=token,
                is_used=False,
                expires_at__gte=timezone.now()
            ).first()
            
            if not reset_token:
                return Response({"status": "error", "message": "Geçersiz veya süresi dolmuş token."}, status=400)
            
            user = reset_token.user
            user.set_password(new_password)
            user.save()
            
            reset_token.is_used = True
            reset_token.save()
            
            return Response({"status": "success", "message": "Şifre başarıyla güncellendi."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API User Registration View - Work
class UserRegistrationAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            'status': 'success',
            'user': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)

# API User Token Pair View - Work
class CustomTokenObtainPairAPIView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return Response({
            'status': 'success',
            'access': response.data['access'],
            'refresh': response.data['refresh'],
            'user': {
                'id': request.user.id,
                'username': request.user.username
            } if request.user.is_authenticated else None
        })

# API Profile View
class ProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'status': 'success',
            'profile': serializer.data
        })

# API Activity View
class ActivityAPIView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [ActivityAccessPermission]  # Özel izin sınıfı

    def get_queryset(self):
        # Admin ise tüm aktiviteleri döndür
        if self.request.user.is_staff:
            return Activity.objects.all()
        # Normal kullanıcı sadece kendi aktivitelerini görür
        return Activity.objects.filter(user=self.request.user)

def password_change_complete(request):
    return render(request, 'users/password/password_reset_complete.html')

@login_required
def profile(request):
    # UpdateUserForm ve UpdateProfileForm yerine ProfileUpdateForm
    profile_form = ProfileUpdateForm(
        instance=request.user.profile,
        data=request.POST or None,
        files=request.FILES or None
    )
    
    if request.method == 'POST':
        if profile_form.is_valid():
            profile_form.save()
            messages.success(request, 'Profil bilgileriniz güncellendi')
            return redirect('profile')
    
    return render(request, 'users/profile/detail.html', {
        'profile_form': profile_form  # Sadece profil formu kullanılıyor
    })