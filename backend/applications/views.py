from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from pypdf import PdfReader
from .models import Resume
from .serializers import ResumeSerializer

class ResumeUploadAPIView(APIView):
    # Exige que o candidato envie o token JWT no cabeçalho para saber quem ele é
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ResumeSerializer(data=request.data)
        
        if serializer.is_valid():
            pdf_file = request.FILES.get('pdf_file')
            if not pdf_file:
                return Response({"error": "Nenhum arquivo enviado."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # 1. Lê o arquivo PDF diretamente da memória/stream do upload
                reader = PdfReader(pdf_file)
                extracted_text = ""
                
                # 2. Varre todas as páginas extraindo as strings de texto
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"

                # 3. Salva o registro atrelando ao usuário logado na requisição (request.user)
                resume = serializer.save(
                    candidate=request.user,
                    extracted_text=extracted_text
                )
                
                return Response({
                    "message": "Currículo processado com sucesso!",
                    "id": resume.id,
                    "extracted_text": resume.extracted_text
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({"error": f"Erro ao processar o PDF: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
