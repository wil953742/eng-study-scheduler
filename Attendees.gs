// 이 코드를 실행한 날짜를 기준으로 +10일까지의 캘린더 이벤트를 불러온다.
// 실행한 날짜는 "일요일" 이라고 기준하고 코드를 짰습니다.
// 전주 일요일에 실행해주세요, 토요일이나 혹은 그전 날짜에 실행하는 경우 실행날짜 기준이 달라져서 스케줄을 짜버리기 때문에 잘못될 수 있습니다.

function listUpcomingEvents() {
  const CALENDAR_ID = '';
  const MAIL_TO_NAME_MAP = {
    'wil953742@yonsei.ac.kr': '웅일',
  }
  const DAY_MAP = ['일', '월', '화', '수', '목' , '금', '토']
  const footerText = `또한 웅일 님이 만들어주신 시간제한 없는 줌 회의 링크도 같이 공지합니다!!
      
Zoom 회의 참가 
~~

회의 ID: 931 2827 1167
암호: 755417

출석부 링크

~~`

  const optionalArgs = {
    timeMin: (new Date()).toISOString(),
    showDeleted: false,
    singleEvents: true,
    orderBy: 'starttime',
    maxResults: 10,
  };
  try {
    const eventList = Calendar.Events.list(CALENDAR_ID, optionalArgs).items
    const newEventList = eventList.map((event) => {
      const {start, attendees = []} = event;

      // '아니오'로 참석을 거절한 경우를 포함시키고 싶지 않다면
      // const acceptedAttendees = attendees.filter((attendee) => attendee.responseStatus !== 'declined')

      return {date: new Date(start.dateTime), attendees};
    })

    const attendeesFilter = (event) => event.attendees && event.attendees.length >= 2;
    const filteredEventList = newEventList.filter((event) => attendeesFilter(event))

    if(filteredEventList.length === 0) {
      console.log('이번주는 진행가능한 세션이 없습니다')
    }

    const getMonday = (inputDay) => {
      const inputDate = new Date(inputDay.getTime());
      const day = inputDate.getDay(),
        diff = inputDate.getDate() - day + 1;
      return new Date(inputDate.setDate(diff));
    }

    const getSunday = (inputDay) => {
      const inputDate = new Date(inputDay.getTime());
      const day = inputDate.getDay(),
        diff = inputDate.getDate() - day + 7;
      return new Date(inputDate.setDate(diff));
    }

    const getNextDate = (inputDay) => {
      const inputDate = new Date(inputDay.getTime());
      return new Date(inputDate.setDate(inputDate.getDate() + 1))
    }

    const firstDate = filteredEventList[0].date.getDay() === 0 ? getNextDate(filteredEventList[0].date) : filteredEventList[0].date;

    const monDate = getMonday(firstDate)
    const sunDate = getSunday(firstDate)

    const startDate = `${monDate.getMonth() + 1}/${monDate.getDate()}`
    const endDate = `${sunDate.getMonth() + 1}/${sunDate.getDate()}` 

    const dateText = `${startDate}-${endDate} 리더공지\n맨 앞에 계신 분이 리더입니다:)`

    const closeDays = [...DAY_MAP, '일'].slice(1)
    const openDays = filteredEventList.map((event) => {
      const { date, attendees } = event

      const dayInKor = DAY_MAP[date.getDay()]
      const attendeesInKor = attendees.map((attendee) => MAIL_TO_NAME_MAP[attendee.email] || attendee.email)

      // 리더 attendees 계산해서 정렬하기

      const idx = closeDays.indexOf(dayInKor)
      if (idx > -1) closeDays.splice(idx, 1)

      return `${dayInKor}: ${attendeesInKor.join(', ')}`
    })

    const attendeesText = openDays.join('\n');
    const canceledText = closeDays.length > 0 ? `(${closeDays.join(', ')}) 세션은 인원 부족으로 취소입니다..!` : '';

    const textList = canceledText ? [dateText, attendeesText, canceledText, footerText] : [dateText, attendeesText, footerText]

    const textOutput = textList.join('\n\n')
    console.log(textOutput)
  } catch (err) {
    console.log('Failed with error %s', err.message);
  }
}
