from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, User, UserManager
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.db import models

class CUserManager(BaseUserManager):
     def create_user(self, email, password=None, **extra_fields):
          if not email:
               raise ValueError(_('A user must have an email address'))
          user = self.model(email=self.normalize_email(email))
          user.set_password(password)
          user.save()
          return user

     def create_superuser(self, email, password=None, **extra_fields):
          extra_fields.setdefault('is_staff', True)
          extra_fields.setdefault('is_superuser', True)
          return self.create_user(email, password, **extra_fields)


class CUser(AbstractBaseUser, PermissionsMixin):
     id = models.CharField(primary_key=True, max_length=255) #needs to be char for idx
     password = models.CharField(_("password"), max_length=128)
     last_login = models.DateTimeField(_("last login"), blank=True, null=True)
     name = models.CharField(_("username"),max_length=255, null=True, blank=True)
     email = models.EmailField(_("email address"), unique=True)
     email_verified = models.DateTimeField(null=True, blank=True)
     image = models.TextField(null=True, blank=True) #it can be long so txt
     #things from django user
     is_staff = models.BooleanField(_("staff status"), default=False) #controlling access to django admin
     is_active = models.BooleanField(_("active"), default=True)
     date_joined = models.DateTimeField(_("date joined"), default=timezone.now) #prisma equivalent is createdAt
     updated_at = models.DateTimeField(_("date updated"), default=timezone.now)

     #setting up email as primary source of id
     USERNAME_FIELD = 'email'

     objects = CUserManager()


