import threading
from src.rabbitmq.post_received import PostMessageReceive

class Threaded_worker(threading.Thread):

    def run(self):
        PostMessageReceive()
        print('start consuming')
        self.channel.start_consuming()


def launchThread():
    print('launch thread')
    td = Threaded_worker()
    td.daemon=True
    td.start()