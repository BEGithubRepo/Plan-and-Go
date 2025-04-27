# users/urls.py

from django.urls import path, include, re_path
from django.contrib.auth import views as auth_views
from .views import (
    home,
    profile,
    password_change_complete,
    WebRegisterView,
    WebLoginView,
    WebLogoutView,
    PasswordResetAPIView,
    PasswordChangeAPIView,
    UserRegistrationAPIView,
    CustomTokenObtainPairAPIView,
    ProfileAPIView,
    ActivityAPIView,
    PasswordResetRequestAPIView,
    PasswordResetConfirmAPIView
)

urlpatterns = [
    # Web UI Routes
    path('', home, name='users-home'),
    path('register/', WebRegisterView.as_view(), name='users-register'),
    path('login/', WebLoginView.as_view(), name='login'),
    path('logout/', WebLogoutView.as_view(), name='logout'),
    path('profile/', profile, name='users-profile'),
    
    # Web Authentication Routes
    path('password-change/', auth_views.PasswordResetView.as_view(
        template_name='users/auth/password_change.html',
        success_url='done/'
    ), name='password_change'),

    # path('password-change/done/', password_change_complete, name='password_change_complete'),
    
    path('password-reset/', auth_views.PasswordResetView.as_view(
        template_name='users/auth/password_reset.html',
        email_template_name='users/emails/password_reset_email.html',
        subject_template_name='users/emails/password_reset_subject.txt',
        success_url='done/'
    ), name='password_reset'),
    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(
        template_name='users/auth/password_reset_done.html'
    ), name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
        template_name='users/auth/password_reset_confirm.html'
    ), name='password_reset_confirm'),
    path('password-reset-complete/', auth_views.PasswordResetCompleteView.as_view(
        template_name='users/auth/password_reset_complete.html'
    ), name='password_reset_complete'),

    # API Routes
    path('api/', include([
        # Authentication Endpoints
        path('auth/', include([
            path('register/', UserRegistrationAPIView.as_view(), name='api-register'),
            path('login/', CustomTokenObtainPairAPIView.as_view(), name='api-login'),
            path('password/reset/', PasswordResetRequestAPIView.as_view(), name='api-password-reset'),
            path('password/confirm/', PasswordResetConfirmAPIView.as_view(), name='api-password-reset'),
        ])),
        
        # Activity Endpoint
        path('activities/', ActivityAPIView.as_view(), name='api-activities'),

        # Profile Endpoints
        path('profile/', include([
            path('', ProfileAPIView.as_view(), name='api-profile'),
        ]))
    ])),

    # Social Auth Routes
    re_path(r'^oauth/', include('social_django.urls', namespace='social')),
]