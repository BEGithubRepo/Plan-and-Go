from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.utils.translation import gettext_lazy as _
from .models import User, Profile
import re

class CustomUserCreationForm(UserCreationForm):
    # Mobil uyumlu alanlar
    mobile = forms.CharField(
        max_length=15,
        required=True,
        widget=forms.TextInput(attrs={
            'placeholder': _('+905551234567'),
            'class': 'form-control',
            'pattern': "\+\d{11,14}"
        }),
        help_text=_('Uluslararası format: +905551234567')
    )
    
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': _('ornek@planandgo.com'),
            'autocomplete': 'email'
        })
    )

    password1 = forms.CharField(
        label=_("Şifre"),
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': _('Şifre (en az 8 karakter)'),
            'data-toggle': 'password',
            'minlength': '8'
        }),
        help_text=_("En az 8 karakter, harf ve sayı içermeli")
    )

    password2 = forms.CharField(
        label=_("Şifre Tekrar"),
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': _('Şifrenizi tekrar girin'),
            'data-toggle': 'password'
        })
    )

    class Meta:
        model = User
        fields = ('email', 'mobile', 'password1', 'password2')
        labels = {
            'email': _('E-posta'),
            'mobile': _('Cep Telefonu')
        }

    def clean_mobile(self):
        mobile = self.cleaned_data.get('mobile')
        if not re.match(r'^\+\d{11,14}$', mobile):
            raise forms.ValidationError(_("Geçersiz telefon numarası formatı"))
        return mobile

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        if len(password1) < 8:
            raise forms.ValidationError(_("Şifre en az 8 karakter olmalı"))
        if not any(char.isdigit() for char in password1):
            raise forms.ValidationError(_("Şifre en az bir rakam içermeli"))
        return password1

class MobileLoginForm(AuthenticationForm):
    username = forms.CharField(
        label=_('E-posta/Mobil'),
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': _('E-posta veya +905551234567'),
            'autocomplete': 'username'
        })
    )
    
    password = forms.CharField(
        label=_("Şifre"),
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': _('Şifre'),
            'autocomplete': 'current-password'
        })
    )

    remember_me = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        label=_('Beni hatırla')
    )

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not (re.match(r'^\+?\d+$', username) or '@' in username):
            raise forms.ValidationError(_("Geçersiz giriş bilgisi"))
        return username

class ProfileUpdateForm(forms.ModelForm):
    avatar = forms.ImageField(
        widget=forms.FileInput(attrs={
            'class': 'form-control',
            'accept': 'image/webp, image/jpeg, image/png'
        }),
        required=False,
        help_text=_('WEBP/JPEG/PNG formatı (max 2MB)')
    )
    
    bio = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
            'maxlength': '500',
            'placeholder': _('Kendinizden bahsedin...')
        }),
        required=False
    )

    class Meta:
        model = Profile
        fields = ['avatar', 'bio']
        labels = {
            'avatar': _('Profil Fotoğrafı'),
            'bio': _('Hakkımda')
        }

    def clean_avatar(self):
        avatar = self.cleaned_data.get('avatar')
        if avatar:
            if avatar.size > 2 * 1024 * 1024:  # 2MB limit
                raise forms.ValidationError(_("Dosya boyutu 2MB'ı geçemez"))
            if not avatar.name.lower().endswith(('.webp', '.jpg', '.jpeg', '.png')):
                raise forms.ValidationError(_("Desteklenmeyen dosya formatı"))
        return avatar

class PasswordResetRequestForm(forms.Form):
    email_or_mobile = forms.CharField(
        label=_('E-posta veya Telefon'),
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': _('E-posta veya +905551234567')
        })
    )

    def clean_email_or_mobile(self):
        data = self.cleaned_data['email_or_mobile']
        if not (data.startswith('+') or '@' in data):
            raise forms.ValidationError(_("Geçerli bir e-posta veya telefon numarası girin"))
        return data