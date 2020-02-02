(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const referId = urlParams.get('referId');
    fetch('https://server.bh24.biz/api/event/landing-visit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            referId
        }),
    });
    fillPartnerData(referId);
    fillStatistics();
})();

async function telegramClick() {
    const countryResult = await fetch('https://ipapi.co/8.8.8.8/json/');
    const result = await countryResult.json();
    const urlParams = new URLSearchParams(window.location.search);
    const referId = urlParams.get('referId');
    const country = !!result.country ? result.country_code.toLowerCase() : 'ru';
    location.replace(`https://t.me/behappy_test_bot?start=${referId}_AND_${country}`);
}

async function fillPartnerData(referId) {
    const partnerDataResponse = await fetch(`https://server.bh24.biz/api/partner/byReferId?referId=${referId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    });
    if (partnerDataResponse.ok) {
        let partnerData = await partnerDataResponse.json();
        document.getElementById('consultant-img').src=`https://server.bh24.biz/data${partnerData.iconUrl}`;
        document.getElementById('consultant-name').innerText = `${partnerData.firstName} ${partnerData.secondName}`;
        document.getElementById('consultant-question-0').innerText = partnerData.questionWhoAreYou;
        document.getElementById('consultant-question-1').innerText = partnerData.questionValue;
        document.getElementById('consultant-question-2').innerText = partnerData.questionStaff;
        document.getElementById('consultant-question-3').innerText = partnerData.questionWhy;
        document.getElementById('consultant-question-4').innerText = partnerData.questionResults;
    }
}

async function fillStatistics() {
    const width = window.innerWidth;
    const statisticsItemCount = width > 650 ? 12 : 8;
    const statisticsDataResponse = await fetch(`https://server.bh24.biz/api/latest-registrations?limit=${statisticsItemCount}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json;charset=utf-8' } });
    if (statisticsDataResponse.ok) {
        let statisticsData = await statisticsDataResponse.json();
        const count = parseInt(statisticsData.count);
        const statistics = statisticsData.registrations;
        document.getElementById('count').innerText = `Всего получили курс: ${count} чел.`;
        const dateHTMLItems = document.getElementsByClassName('registration-table__title');
        const flagHTMLItems = document.getElementsByClassName('registration-table__flag-img');

        const localizeMonth = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сенятбря', 'октября', 'ноября', 'декабря'];

        for(let el = 0; el < count; el++) {
            const registrationDate = new Date(statistics[el].createdDate);
            const registrationHours = addZero(2, registrationDate.getHours());
            const registrationMinutes = addZero(2, registrationDate.getMinutes());
            const registrationYear = registrationDate.getFullYear();
            const registrationMonth = localizeMonth[registrationDate.getMonth()];
            const registrationDay = registrationDate.getDate();

            dateHTMLItems[el].innerHTML = `${registrationHours}:${registrationMinutes}, ${registrationDay} ${registrationMonth} ${registrationYear} г.`;
            flagHTMLItems[el].src = `https://server.bh24.biz/data/flags-landing/${statistics[el].country}.png`;
        }
    }

    function addZero(digits_length, source) {
        let text = source + '';
        while (text.length < digits_length)
            text = '0' + text;
        return text;
    }

}