from apscheduler.schedulers.asyncio import AsyncIOScheduler

class ScheduleService:
    @staticmethod
    def fetch_current_time():
        return
    @classmethod
    def start_scheduler(cls):
        scheduler = AsyncIOScheduler()

        #scheduler.add_job(cls.receivePost, trigger=IntervalTrigger(seconds=20))
        # scheduler.add_job(cls.fetch_current_time, trigger=IntervalTrigger(minutes=10)) #10p moi ngay
        
        #scheduler.add_job(cls.fetch_current_time, trigger=CronTrigger(hour=10, minute=0)) 10h moi ngay
         # Đăng ký tác vụ để chạy vào lúc 5 giờ sáng mỗi ngày
        # scheduler.add_job(cls.fetch_current_time, trigger=CronTrigger(hour=5, minute=0))

        # Đăng ký tác vụ để chạy vào lúc 11 giờ tối mỗi ngày
        #scheduler.add_job(cls.fetch_current_time, trigger=CronTrigger(hour=23, minute=0))
        scheduler.start()
