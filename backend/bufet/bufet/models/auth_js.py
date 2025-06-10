from django.db import models
from .user import CUser


class JSVerificationToken(models.Model):
    identifier = models.TextField()
    expires = models.DateTimeField()
    token = models.TextField()

    class Meta:
        db_table = 'js_verification_token'
        unique_together = (('identifier', 'token'),)

class JSAccount(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    user = models.ForeignKey(CUser, on_delete=models.CASCADE, related_name='accounts')
    type = models.CharField(max_length=255)
    provider = models.CharField(max_length=255)
    provider_account_id = models.CharField(max_length=255, db_column='providerAccountId')
    refresh_token = models.TextField(blank=True, null=True)
    access_token = models.TextField(blank=True, null=True)
    expires_at = models.BigIntegerField(blank=True, null=True)
    id_token = models.TextField(blank=True, null=True)
    scope = models.TextField(blank=True, null=True)
    session_state = models.TextField(blank=True, null=True)
    token_type = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField( auto_now_add=True)
    updated_at = models.DateTimeField( auto_now=True)

    class Meta:
        db_table = 'js_accounts'
        unique_together = (('provider', 'provider_account_id'),)

class JSSession(models.Model):
    id =models.CharField(primary_key=True, max_length=255)
    user = models.ForeignKey(CUser, on_delete=models.CASCADE, related_name='sessions')
    expires = models.DateTimeField()
    session_token = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = 'js_sessions'

class JSUserPasswordHash(models.Model):
    hash = models.TextField()
    user = models.ForeignKey(CUser, on_delete=models.CASCADE, related_name='password_hashes')
    class Meta:
        db_table = 'js_user_password_hashes'
