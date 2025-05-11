# badges/views.py

from rest_framework import generics, permissions, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import BadgeTrade, TradeBadge, UserBadge
from .serializers import 
from .serializers import (
    UserBadgeSerializer,
    BadgeTradeSerializer)

class UserBadgeListView(generics.ListAPIView):
    serializer_class = UserBadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)

class UserBadgeListAPIView(generics.ListAPIView):
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)

class UserBadgeDetailAPIView(generics.RetrieveAPIView):
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)

class BadgeTradeViewSet(viewsets.ModelViewSet):
    queryset = BadgeTrade.objects.all()
    serializer_class = BadgeTradeSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            sender_badges = UserBadge.objects.filter(
                user=request.user, 
                badge__in=serializer.validated_data['badges']
            )
            if sender_badges.count() != len(serializer.validated_data['badges']):
                return Response(
                    {"error": _("You don't own all selected badges.")},
                    status=status.HTTP_400_BAD_REQUEST
                )
            trade = serializer.save(sender=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        trade = self.get_object()
        if trade.receiver != request.user:
            return Response({"error": _("Unauthorized action.")}, status=403)
        
        new_status = request.data.get('status')
        if new_status == BadgeTrade.ACCEPTED:
            for badge in trade.badges.all():
                UserBadge.objects.filter(user=trade.sender, badge=badge).delete()
                UserBadge.objects.create(user=trade.receiver, badge=badge)
        trade.status = new_status
        trade.save()
        return Response({"status": "updated"})