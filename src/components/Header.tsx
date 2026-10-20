interface HeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
}

export function Header({ search, onSearchChange }: HeaderProps) {
    return (
        <header className="app-header">
            <h1>Університетський розклад</h1>
            <label>
                Пошук записів
                <input
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Введіть назву..."
                />
            </label>
        </header>
    );
}