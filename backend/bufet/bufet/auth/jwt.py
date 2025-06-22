from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import base64
import json
from typing import Any, Dict
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from jwcrypto import jwe, jwk
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

def get_derived_encryption_key(secret: str, salt: str) -> bytes:
    salt_bytes = salt.encode("utf-8")
    info_string = f"Auth.js Generated Encryption Key ({salt})".encode("utf-8")
    hkdf = HKDF(algorithm=hashes.SHA256(), length=64, salt=salt_bytes, info=info_string)  # 64 bytes for A256CBC-HS512
    key = hkdf.derive(secret.encode("utf-8"))
    if len(key) != 64:
        raise ValueError("Derived key length is incorrect. Expected 64 bytes, got {} bytes.".format(len(key)))
    return key

def decode_authjs_session(token: str) -> Dict[str, Any]:
    auth_secret = settings.AUTH_SECRET
    auth_salt = settings.AUTH_SALT
    key_bytes = get_derived_encryption_key(auth_secret, auth_salt)
    key = jwk.JWK(kty="oct", k=base64.urlsafe_b64encode(key_bytes).decode("utf-8"))
    try:
        jwe_token = jwe.JWE()
        jwe_token.deserialize(token)
        jwe_token.decrypt(key)
        data = jwe_token.payload
        # Parse the decrypted data into JSON
        decoded_token = json.loads(data.decode("utf-8"))
        return decoded_token
    except Exception as e:
        print(f"Error during decryption: {e}")
        raise e

class JWEAuthentication(BaseAuthentication):
    """
    DRF authentication class to decrypt JWE token issued by NextAuth (Auth.js)
    using the provided decode_authjs_session function.
    Expects header: Authorization: Bearer <JWE token>
    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.lower().startswith('bearer '):
            return None

        token = auth_header.split(' ', 1)[1]
        try:
            payload = decode_authjs_session(token)
        except Exception as e:
            raise AuthenticationFailed(f'Invalid JWE token: {e}')

        email = payload.get('email')
        if not email:
            raise AuthenticationFailed("Token payload missing 'email'.")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found')

        return (user, None)
