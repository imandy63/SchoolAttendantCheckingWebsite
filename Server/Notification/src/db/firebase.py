from firebase_admin import credentials,messaging
import firebase_admin
import firebase_admin.messaging
from src.configs.config import Settings

class Firebase:
    _instance = None

    def __init__(self):
        self.initializeFirestoreApp()

    def initializeFirestoreApp(self):
        if not firebase_admin._apps:
            cred = credentials.Certificate(Settings.FIREBASE_CREDENTIALS)
            firebase_admin.initialize_app(cred)

    @staticmethod
    def getInstance():
        if Firebase._instance == None:
            Firebase._instance = Firebase()
        return Firebase._instance
    
    
    @staticmethod
    def getMessaging():
        return messaging