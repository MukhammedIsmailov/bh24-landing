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
})();

async function telegramClick() {
    const countryResult = await fetch('https://ipapi.co/8.8.8.8/json/');
    const result = await countryResult.json();
    const urlParams = new URLSearchParams(window.location.search);
    const referId = urlParams.get('referId');
    const country = !!result.country ? result.country_code.toLowerCase() : 'ru';
    location.replace(`https://t.me/BeHappy24ClubBot?start=${referId}_AND_${country}`);
}