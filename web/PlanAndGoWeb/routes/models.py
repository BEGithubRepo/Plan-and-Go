from django.contrib.gis.db import models

class Route(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    start_point = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Waypoint(models.Model):
    route = models.ForeignKey(Route, related_name='waypoints', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    order = models.PositiveIntegerField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    arrival_time = models.DateTimeField(null=True, blank=True)