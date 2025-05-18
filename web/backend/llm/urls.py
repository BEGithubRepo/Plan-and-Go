from django.urls import path
from . import views

urlpatterns = [
    path('api/ask/', views.LLMInteractionView.as_view(), name='ask-llm'),
]