from django.urls import path
from.import views

urlpatterns = [
    path('todos/', views.TodoListCreate.as_view()),
    path('todos/<int:pk>', views.TodoRetrieveUpdateDestroy.as_view()),
    path('todos/<int:pk>/complete', views.TodoToggleComplete.as_view()),
    
    path('padoms/', views.PadomsListCreate.as_view()),
    path('padoms/<int:pk>', views.PadomsRetrieveUpdateDestroy.as_view()),
    path('padoms/<int:pk>/complete', views.PadomsToggleComplete.as_view()),
    path('signup/',views.signup),
    path('login/',views.login),
    
]
