from django.db import models
from django.contrib.auth.models import User
from jobs.models import Job
from django.core.exceptions import ValidationError

class Resume(models.Model):
    candidate = models.ForeignKey(User, on_delete=models.CASCADE)
    pdf_file = models.FileField(upload_to='resumes/')
    extracted_text = models.TextField(blank=True)

    def __str__(self):
        return self.candidate.username

class Application(models.Model):
    candidate = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate.username} - {self.job.title}"
    
    def clean(self):
        if self.score < 0 or self.score > 100:
            raise ValidationError('Score must be between 0 and 100.')

    def save(self, *args, **kwargs):
        """
        Sobrescreve o método de salvamento para calcular o score automaticamente
        se houver um currículo cadastrado para o candidato.
        """
        import re

        # 1. Busca o currículo mais recente do candidato
        resume = Resume.objects.filter(candidate=self.candidate).last()
        
        if resume and resume.extracted_text and self.job.requirements:
            # 2. Normaliza o texto do currículo: remove pontos e transforma qualquer quebra de linha (\n)
            # ou múltiplos espaços em um único espaço em branco saudável.
            resume_clean = resume.extracted_text.replace('.', '').lower()
            resume_normalized = re.sub(r'\s+', ' ', resume_clean).strip()
            
            # 3. Transforma os requisitos da vaga em uma lista de termos limpos e normalizados
            req_clean = self.job.requirements.replace('.', '').lower()
            req_words = [re.sub(r'\s+', ' ', word.strip()) for word in req_clean.split(',') if word.strip()]
            
            # 4. Conta quantos dos requisitos da vaga aparecem dentro do texto normalizado do currículo
            matched_words = 0
            for word in req_words:
                if word in resume_normalized:
                    matched_words += 1
            
            # 5. Calcula a porcentagem de match (Score de 0 a 100)
            if len(req_words) > 0:
                calculated_score = (matched_words / len(req_words)) * 100
                self.score = round(calculated_score, 2)
        else:
            # Caso não tenha currículo ou texto extraído, o score padrão vira 0
            self.score = 0
            
        # Executa as validações do clean antes de persistir no banco
        self.full_clean()
        super().save(*args, **kwargs)