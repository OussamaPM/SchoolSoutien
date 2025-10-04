import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square items-center justify-center">
                <AppLogoIcon className="w-22 fill-current text-white dark:text-black" />
            </div>
            {/* <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    School Soutien
                </span>
            </div> */}
        </>
    );
}
