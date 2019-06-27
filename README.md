JavaScript libraly - Dooli
====================

v1.9.6

### install
```bash
npm i dooli
```

Мини библиотека, реализованная на ES6.
Пример: 
```javascript
Dooli("dooli")
    .css("color: #F00", "font-size: 23px")
    .addClass("test", "test-new-dooli")
    .removeClass("dooli", "test")
    .attr("data-type=0", "data-start=hi!")
    .html()
```

### Методы библиотеки: ###

| Метод         | Описание               | Параметры |
| ------------- | ------------------ | ----- |
| Dooli | Устанавливет DOM элемент | `selector` - *id* или *querySelectorAll*<br/> `options` - объект, содержащий `isTag` если необходим `getElementsByTagName` |
| obj | возвращает установленный DOM элемент | не требуется |
| first | возвращает первый элемент | не требуется |
| getNodesByAttr | возвращает коллекцию по аттрибутам либо контекст | `attr` - (string), например, `[data-type="1"]`, `flag` - (boolean), если флаг, то вовращает коллекцию по поиску, иначе контекст `Dooli` |
| num | возвращает элемент по его позиции | `index` - позиция элемента |
| css    | применяет CSS-стили к указанному элементу    | параметры через запятую |
| html    | Применяет или возвращает содержимое контейнера | Если указан `value`, то применит его, иначе вернет содержимое |
| addClass  | добавляет CSS-классы для елемента       | параметры через запятую |
| removeClass | удаляет CSS-классы для элемента | параметры через запятую |
| focus | задает фокус элементу | не требует |
| attr | задает 1 или несколько новых аттрибутов элементу | параметры через запятую |
| get | возвращает 1 или несколько аттрибутов элемента (массив) | параметры через запятую |
| show | показывает элемент | не требует |
| hide | скрывает элемент | не требует |
| width | возвращает ширину элемента | не требует |
| height | возвращает высоту элемента | не требует |
| prepend | добавляет 1 или несколько элементов в начало блока | параметры через запятую |
| append | добавляет 1 или несколько элементов в конец блока | параметры через запятую |
| click | устанавливает или вызывает обработчик элемента | `type` - тип события<br/> `callback` - коллбек<br/> `context` - контекст коллбека, если не указан, то принимает внутренний контекст |
| clone | клонирует элемент | не требует |
| addEvent | добавляем событие к элементу | `el (or null)` - куда вешаем событие<br/> `event` - название события (click, mousemove), `callback` - обработчик клика, `context` - контекст для обработчкика |
| removeEvent | удаляем событие у элемента | `el (or null)` - элемент<br/> `event` - название события (click, mousemove), `callback` - обработчик клика, `context` - контекст для обработчкика |
| bindEvent | применяет `removeEvent` и `addEvent` с таким же числом параметров |
| bindMultiple | применяет несколько обработчиков на элемент | `el (or null)`, `object` - объект событий с ключем названия ивента и его обработчиком |

Методы, которые не возвращают результата можно чейнить.

### Таймер ###
Чтобы установить таймер на 10 секунд, достаточно сделать так:
```javascript
const time = require('dooli/modules/time.dooli');
time.timer(10, () => {
    alert('10 секунд прошло');
});
```
Можно также триггерить коллбек каждые n секунд, пока таймер не завершил свою работу
```javascript
const time = require('dooli/modules/time.dooli');
time.timer(86400, () => {
    console.log('день прошел');
}, 1, (options) => {
    console.log(`до конца дня осталось: ${options.hours}:${options.minutes}:${options.seconds}`);
});
```
`options` - объект, который содержит в себе ключи `days`, `hours`, `minutes`, `seconds`, `timeEnd` до конца работы таймера

### События ###
Навешивать события можно несколькими способами:
```javascript
Dooli('button').click(callback);
Dooli('button').addEvent('click', callback /*, context */);
Dooli('button').bindEvent('click', callback /*, context */);
Dooli('button').bindMultiple({
    click: () => {},
    mousemove: () => {},
});
```

### Ивенты
Все довольно понятно:
```javascript
require('dooli/modules/events.dooli');
D.events.on('event', () => {
    // делаем что то при каждом триггере ивента event
});
D.events.once('event', () => {
    // делаем что то один раз при триггере ивента event
});
// Создаем кастомный ивент с именем event
D.events.trigger('event'/*, param1, param2, param3 */);
```

### Стороннее расширение библиотеки ###
Вы также можете расширить стандарный функционал библиотеки, например:

```javascript
// наследуемся
class MyDooli extends DooliAbstract {
  html() {
    console.log("Ваша реализация метода HTML");
  }
}

//и используем
(new MyDooli("element_id")).html();
```
Расширение модулей:
```javascript
// Создаем новый модуль
D.myModule = {};
D.myModule.sayHi = () => alert('Привет!');

// Расширяем существующий
D.touch.SENSITIVITY_X = 200; // меняем чувствительность тача
D.touch.callbacks.callbackTouchBottom = () => {
    // создаем свой обработчик свайпа снизу вверх
};
```

### Шаблонизатор ###
Пример, есть такая разметка:
```html 
<div id="dooli_tpl">
  <div>{text}</div>
</div>
```
И нам надо продублировать содержимое контейнера dooli_object и заменить все {text} на что-то полезное, то это можно сделать так:
```javascript
const Template = require('dooli/modules/template.dooli');
let tpl = new Template();
tpl.init("dooli_tpl");
tpl.each(2) //дублируем 2 раза
   .parse("text", "Hello!"); //заменяем {text} на Hello! 
```

Результат будет таким:
> Hello!

> Hello!

### Условия ###

```html
<dooli:if var="first">Первое условие</dooli:if>
<div dooli-if-var="second">div will be hidden</div>
```
 
Управлять условиями и переменными можно так:
```javascript
tpl.setIfBlock('first', false);
tpl.setIfBlock('second', false);
```

В таком случае текст `Первое условие` отрендерен на странице не будет. Изменить значение переменной можно, передав вторым и третьим агрументом `true`.

### Итерация ###

```html
<dooli:iterate id="iterateWrap">
    <div>я в цикле {count} раз. My name is {name}. I'm {age}.</div>
</dooli:iterate>
```
```javascript
tpl.setIteration('iterateWrap', {
    data: [
        {
            name: 'Artem',
            age: 20,
        },
        {
            name: 'Anya',
            age: 24,
        },
    ],
});
```
 `setIteration` принимает два аргумента: `irerateWrap` - id контейнера, `data` - массив объектов, которыми будет заполнена строка.
 В данном примере результат *HTML* будет таким:
 
```html
<div>я в цикле 2 раз. My name is Artem. I'm 20.</div>
<div>я в цикле 2 раз. My name is Anya. I'm 24.</div>
```
`dooli:iterate` может быть любым другим элементом







