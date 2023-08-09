from rest_framework.response import Response
from api.models import ToDo
from rest_framework import status, viewsets
from rest_framework.views import APIView
from api.serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, UserChangePasswordSerializer, SendPasswordResetEmailSerializer, UserPasswordResetSerializer, ToDoSerializer
from django.contrib.auth import authenticate
from .renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated



# Create your views here.

#generate token manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({'msg': 'registration success', 'token':token}, status=status.HTTP_201_CREATED)
       

class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, formate=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            token = get_tokens_for_user(user)
            return Response({'msg':'Login success', 'token':token}, status=status.HTTP_200_OK)
        else:
            return Response({'errors':{'non_field_errors':['Email or Password is not valid']}}, status=status.HTTP_404_NOT_FOUND)
        
    
class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, formate=None):
        serializer = UserProfileSerializer(request.user)
        # if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, formate=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
        serializer.is_valid(raise_exception=True)
        return Response({'msg':'Password changed successfully'}, status=status.HTTP_200_OK)
        

class SendPasswordResetEmailView(APIView):
    renderer_classes=[UserRenderer]
    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'msg':'Password reset link send, please check your email'}, status=status.HTTP_200_OK)
        
class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
        serializer.is_valid(raise_exception=True)
        return Response({'msg':'Password reset successfully!'}, status=status.HTTP_200_OK)






class ToDoAPI(viewsets.ModelViewSet):
    queryset = ToDo.objects.all()
    serializer_class = ToDoSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        todo = ToDo.objects.filter(todo_id = request.user.id)
        serializer = ToDoSerializer(todo, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        print(request.data)
        todo = request.data.get('todo')
        complete = request.data.get('complete')
        priority = request.data.get('priority')
        todo_id = request.user.id
        data = {
            'todo': todo,
            'complete': complete,
            'priority': priority,
            'todo_id':todo_id
            }
        serializer = ToDoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'data created'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)
        
