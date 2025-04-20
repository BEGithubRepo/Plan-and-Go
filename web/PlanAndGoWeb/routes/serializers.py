from rest_framework import serializers

class WaypointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waypoint
        fields = '__all__'
        read_only_fields = ('route',)

class RouteSerializer(serializers.ModelSerializer):
    waypoints = WaypointSerializer(many=True, required=False)
    
    class Meta:
        model = Route
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Bitiş tarihi başlangıç tarihinden önce olamaz")
        return data