const btnKick1 = document.getElementById('btn-kick1');
const btnKick2 = document.getElementById('btn-kick2');
const $logs = document.getElementById('logs');
let isGameOver = false;

function random(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderHPLife() {
    const { damageHP, defaultHP, elHP } = this;
    elHP.innerText = `${damageHP} / ${defaultHP}`;
}

function renderProgressbarHP() {
    const { damageHP, defaultHP, elProgressbar } = this;
    const percent = (damageHP / defaultHP) * 100;

    elProgressbar.style.width = `${percent}%`;
    elProgressbar.classList.remove('low', 'critical');

    if (percent < 20) {
        elProgressbar.classList.add('critical');
    } else if (percent < 60) {
        elProgressbar.classList.add('low');
    }
}

function renderHP() {
    this.renderHPLife();
    this.renderProgressbarHP();
}

function changeHP(count, defender, attacker) {
    if (isGameOver) return; 

    this.damageHP -= count;
    
    if (this.damageHP <= 0) {
        this.damageHP = 0;
        isGameOver = true;
        
        btnKick1.disabled = true;
        btnKick2.disabled = true;

        setTimeout(() => {
            alert(`${this.name} програв бій!`);
        }, 300);
    }
    
    this.renderHP();

    const logText = generateLog(attacker, defender, count);
    
    const $p = document.createElement('p');
    $p.innerText = logText;

    $logs.insertBefore($p, $logs.children[0]);
}

const character = {
    name: 'Pikachu',
    defaultHP: 100,
    damageHP: 100,
    elHP: document.getElementById('health-character'),
    elProgressbar: document.getElementById('progressbar-character'),
    renderHPLife,
    renderProgressbarHP,
    renderHP,
    changeHP
};

const enemy = {
    name: 'Charmander',
    defaultHP: 100,
    damageHP: 100,
    elHP: document.getElementById('health-enemy'),
    elProgressbar: document.getElementById('progressbar-enemy'),
    renderHPLife,
    renderProgressbarHP,
    renderHP,
    changeHP
};

function generateLog(firstPerson, secondPerson, count) {
    const { name: firstName } = firstPerson;
    const { name: secondName, damageHP, defaultHP } = secondPerson;

    const logs = [
        `${firstName} згадав щось важливе, але зненацька ${secondName}, не пам'ятаючи себе від переляку, вдарив у передпліччя ворога.`,
        `${firstName} поперхнувся, і за це ${secondName} з переляку приклав прямий удар коліном у лоб ворога.`,
        `${firstName} забився, але в цей час нахабний ${secondName}, прийнявши вольове рішення, нечутно підійшовши ззаду, вдарив.`,
        `${firstName} прийшов до тями, але зненацька ${secondName} випадково наніс потужний удар.`,
        `${firstName} поперхнувся, але в цей час ${secondName} нехотя роздробив кулаком супротивника.`,
        `${firstName} здивувався, а ${secondName} похитнувшись вліпив підлий удар.`,
        `${firstName} висякався, але зненацька ${secondName} провів дроблячий удар.`,
        `${firstName} провів прийоми, і раптово нахабний ${secondName} безпричинно вдарив у ногу противника.`,
        `${firstName} засмутився, як раптом, зненацька ${secondName} випадково вліпив стопою в живіт суперника.`,
        `${firstName} намагався щось сказати, але раптом, зненацька ${secondName} зі нудьги, розбив бров супернику.`
    ];

    const randomText = logs[random(logs.length - 1)];

    return `${randomText} -${count}, [${damageHP}/${defaultHP}]`;
}

function performAttack(dmgToEnemy, dmgToCharacter) {
    enemy.changeHP(dmgToEnemy, enemy, character);
    if (!isGameOver) {
        character.changeHP(dmgToCharacter, character, enemy);
    }
}


/**
 * 
 * @param {number} limit
 * @param {HTMLElement} btn
 * @returns {Function}
 */
function createClickCounter(limit, btn) {
    let clicksCount = 0;

    return function (actionCallback) {
        if (clicksCount >= limit) {
            console.log(`Кнопку "${btn.innerText.trim()}" більше не можна натискати (досягнуто ліміт ${limit})`);
            return;
        }

        clicksCount++;
        const remainingClicks = limit - clicksCount;

        console.log(`[${btn.innerText.trim()}] Натиснуто разів: ${clicksCount} | Залишилось кліків: ${remainingClicks}`);

        actionCallback();

        if (remainingClicks === 0) {
            btn.disabled = true;
            console.log(`Кнопку "${btn.innerText.trim()}" заблоковано!`);
        }
    };
}

const kick1Counter = createClickCounter(6, btnKick1);
const kick2Counter = createClickCounter(6, btnKick2);

btnKick1.addEventListener('click', function () {
    kick1Counter(() => {
        performAttack(random(20, 10), random(20, 10));
    });
});

btnKick2.addEventListener('click', function () {
    kick2Counter(() => {
        performAttack(random(40, 20), random(35, 15));
    });
});
