# routes/forms.py
from django import forms
from .models import Route

class RouteCreateForm(forms.ModelForm):
    start_point = forms.CharField(
        widget=forms.TextInput(attrs={
            'placeholder': 'POINT(longitude latitude)',
            'class': 'wkt-geometry-input'
        }),
        help_text="WKT formatında girin. Örnek: POINT(28.9784 41.0082)"
    )
    
    destination = forms.CharField(
        widget=forms.TextInput(attrs={
            'placeholder': 'POINT(longitude latitude)',
            'class': 'wkt-geometry-input'
        })
    )

    class Meta:
        model = Route
        fields = ['title', 'start_point', 'destination', 'start_date', 'end_date', 'is_shared']
        widgets = {
            'start_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'end_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        }