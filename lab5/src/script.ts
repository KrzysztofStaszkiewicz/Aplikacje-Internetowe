const msg: string = "Hello!";
alert(msg)

const styles: string[] = ['style-1.css', 'style-2.css', 'style-3.css'];


const changeStyle = (stylePath: string): void => {
    let linkElement = document.getElementById('dynamic-theme') as HTMLLinkElement;

    if (linkElement) {
        linkElement.href = stylePath;
    } else {
        linkElement = document.createElement('link');
        linkElement.id = 'dynamic-theme';
        linkElement.rel = 'stylesheet';
        linkElement.href = stylePath;
        document.head.appendChild(linkElement);
    }
    
};

const createStyleButtons = (): void => {
    const swapContainer = document.getElementById('swap');

    if (!swapContainer) {
        console.error('Nie znaleziono elementu o id "swap"!');
        return;
    }

    swapContainer.innerHTML = '';

    styles.forEach((styleName, index) => {
        const listItem = document.createElement('li');
        listItem.style.listStyle = 'none';
        listItem.style.display = 'inline-block';
        listItem.style.margin = '10px';

        const button = document.createElement('button');
        button.innerText = `Styl ${index + 1}`;
        button.classList.add("przyciski");

        button.addEventListener('click', () => {
            changeStyle(styleName);
        });

        listItem.appendChild(button);
        swapContainer.appendChild(listItem);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    createStyleButtons();
    
    changeStyle(styles[0]);
});