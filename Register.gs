// 캘린더 등록 코드입니다.
// 토요일 00~00시 사이에 자동으로 한 번 시

function registerCalendarEvents() {
  const CALENDAR_ID = '';
  const DAY_MAP = ['일', '월', '화', '수', '목' , '금', '토']
  const today = new Date();
  
  const getNextMonday = (inputDay) => {
    const inputDate = new Date(inputDay.getTime());
    const day = inputDate.getDay(),
      diff = inputDate.getDate() - day + 8;
    return new Date(inputDate.setDate(diff));
  }

  const getNextDay = (inputDay, diff) => {
    const inputDate = new Date(inputDay.getTime());
    return new Date(inputDate.setDate(inputDate.getDate() + diff))
  }

  const formmatDate = (inputDay) => {
    const year = inputDay.getFullYear();
    const month = inputDay.getMonth() + 1;
    const date = inputDay.getDate();
    
    const newMonth = ('0' + month).slice(-2)
    const newDate = ('0' + date).slice(-2)

    return `${year}-${newMonth}-${newDate}`
  }

  const getResource = (targetDate, startTime, endTime) => ({
    id: 'c' + targetDate.replaceAll('-', ''),
    summary: 'ENG Study Session',
    start: {
      'dateTime': `${targetDate}T${startTime}`,
      'timeZone': 'Asia/Seoul'
    },
    end: {
      'dateTime': `${targetDate}T${endTime}`,
      'timeZone': 'Asia/Seoul'
    },
  })

  const nextMonday = getNextMonday(today);
  
  for(let i=0; i<7; i++) {
    let targetDay
    let targetDate
    try {
      targetDay = getNextDay(nextMonday, i);
      targetDate = formmatDate(targetDay);

      const studyStartTime = i >= 4 ? '10:00:00' : '21:00:00'
      const studyEndTime = i >= 4 ? '11:30:00' : '22:30:00'

      const resource = getResource(targetDate, studyStartTime, studyEndTime)
      Calendar.Events.insert(resource, CALENDAR_ID)
      console.log(`${targetDate} ${DAY_MAP[targetDay.getDay()]}요일 캘린더 등록이 완료되었습니다!`)
    } catch(e) {
      if(e?.details?.code?.toString() === '409') {
        console.log(`${targetDate} ${DAY_MAP[targetDay.getDay()]}요일은 이미 캘린더가 생성된 요일입니다!`)

        continue;
      }

      console.log(`${targetDate} ${DAY_MAP[targetDay.getDay()]}요일 캘린더 등록 중 알수없는 에러가 발생했습니다. 확인 후에 직접 등록해주세요!`)
    }
  }
}
