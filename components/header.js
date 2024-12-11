// /components/header.js
class Header {
    constructor() {
        this.headerElement = document.getElementById('header');
    }

    render() {
        this.headerElement.innerHTML = `
            <div class="logo">My Board Games</div>
            <nav>
                <a href="index.html">Home</a>
                <a href="login.html">Login</a>
                <a href="register.html">Register</a>
            </nav>
        `;
    }
}

const header = new Header();
header.render();
