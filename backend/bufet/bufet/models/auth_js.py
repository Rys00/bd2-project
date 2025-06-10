from django.db import models

class JSVerificationToken(models.Model):
    identifier = models.TextField()
    expires = models.DateTimeField()
    token = models.TextField()

    class Meta:
        managed = False
        db_table = 'js_verification_token'  # Changed here
        unique_together = (('identifier', 'token'),)

class JSAccount(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField(db_column='userId')
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

    class Meta:
        managed = False
        db_table = 'js_accounts'  # Changed here

class JSSession(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField(db_column='userId')
    expires = models.DateTimeField()
    session_token = models.CharField(max_length=255, db_column='sessionToken')

    class Meta:
        managed = False
        db_table = 'js_sessions'  # Changed here

class JSUser(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    email_verified = models.DateTimeField(db_column='emailVerified', blank=True, null=True)
    image = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'js_users'  # Changed here