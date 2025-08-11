import {Outlet} from 'react-router-dom';

const MainLayout = () => {
    return (
        <div>
            <header>
                <h1>mandamong</h1>
            </header>
            <main>
                <Outlet/>
            </main>
            <footer>
                <p>© 2025 mandamong</p>
            </footer>
        </div>
    );
};

export default MainLayout;
