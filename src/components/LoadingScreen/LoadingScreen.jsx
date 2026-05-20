import './LoadingScreen.css';

export default function LoadingScreen() {
    return (
        <div id="loadingScreen">
            <h2>Link House</h2>
            <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
}
