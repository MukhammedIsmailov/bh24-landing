(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const referId = urlParams.get('referId');
    fetch('https://bh24.biz/api/event/landing-visit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            referId
        }),
    });
})();

async function telegramClick() {
    const countryResult = await fetch('http://ip-api.com/json');
    const result = await countryResult.json();
    const urlParams = new URLSearchParams(window.location.search);
    const referId = urlParams.get('referId');
    location.replace(`https://t.me/BeHappy24ClubBot?start=${referId}_AND_${result.countryCode.toLowerCase()}`);
}