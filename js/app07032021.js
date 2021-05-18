document.addEventListener('DOMContentLoaded',async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const referId = urlParams.get('referId') ?? 'gohappy';

    const referData = await fetch('https://api.gohappy.team/api/event/landing-visit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            referId
        }),
    });

    if (!referData.ok) document.write()

    const partnerDataResponse = await fetch(`https://api.gohappy.team/api/partner/byReferId?referId=${referId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    });
    const partnerData = await partnerDataResponse.json();
    document
        .getElementById('tg_button')
        .addEventListener('click', async () => await telegramClick(partnerData.id))
    await fillPartnerData(partnerData);
    await fillStatistics();
});

async function telegramClick(rid) {
    const countryResult = await fetch('https://api.gohappy.team/api/getCountryByIp');
    const result = await countryResult.json();
    const urlParams = new URLSearchParams(window.location.search);
    const cc = result.country.toLowerCase();
    const ts = 'land1';
    const startPayload = btoa(JSON.stringify({ rid, cc, ts }))
    location.replace(`https://t.me/gohappy_bot?start=${startPayload}`);
}

async function fillPartnerData(partnerData) {

    if (!!partnerData) {
        document.getElementById('consultant-img').src=`https://api.gohappy.team/data${partnerData.iconUrl}`;
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
    const statisticsDataResponse = await fetch(`https://api.gohappy.team/api/latest-registrations?limit=${statisticsItemCount}`,
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
            flagHTMLItems[el].src = `https://api.gohappy.team/data/flags-landing/${statistics[el].country}.png`;
        }
    }

    function addZero(digits_length, source) {
        let text = source + '';
        while (text.length < digits_length)
            text = '0' + text;
        return text;
    }

}
