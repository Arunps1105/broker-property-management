from django.http import JsonResponse

def home(request):
    return JsonResponse({
        "status": "ok",
        "message": "Broker Property Management API is running"
    })