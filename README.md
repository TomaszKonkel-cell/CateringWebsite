# Aplikacja webowa strony kateringu żywnościowego

## Opis

Aplikacja działa w oparciu o model klient-serwer

Strona serwerowa działa na frameworku Spring Boot Javy, co zapewnia ciągłość działania i reakcje na działania użytkownika

Komunikacja odbywa się poprzez Kontroler w którym zawarte są endpointy (adresy pod którymi udostępnione są poszczególne funkcjonalności/zasoby)

Dane są przechowywane w bazie danych (postgreSQL) na podstawie modeli

Strona klienta oparta na frameworku React odpowiada za wygląd aplikacji jak i możliwość komunikacji z serwerem (pobieranie, dodawanie i modyfikowanie danych)

Projekt zawiera nastepujące moduły :

### `Konta klientów`

Tworzenie kont poprzez rejestracje podstawowych informacji (imie, nazwisko, numer telefonu, adres e-mail i hasło)

Do stworzenia konta potrzebna jest jego aktywacja z wiadomości e-mail na który przychodzi link aktywacyjny

- Po podaniu podstawowych danych w bazie tworzone jest konto z statusem aktywności na false, oraz generowany jest token do uwierzytelnienia aktywowania
- Na tym etapie hasło zostaje już szyfrowane
- Na adres e-mail wysyłany jest link w którym zawarty jest token, po wejściu na niego do kontrolera wysyłana jest informacja z tokenem i konto zostaje aktywowane, a token usunięty z bazy
- Zmiana tokenu w linku, który wygenerowany jest przez serwer spowoduje wyświetlenie błędu informującego o złym tokenie
- Na jeden adres e-mail można stworzyć tylko jedno konto, w przypadku próby stworzenia konta na istniejący adres e-mail zwraca jest informacja z błędem

Możliwe jest przywrócenie hasła przez link z wiadmości e-mail

- Należy podać adres e-mail do istniejącego konta
- Na podany adres wysyłany jest link do formularza tworzenia nowego hasła
- Podanie nie istniejącego adresu powoduje zwrócenie błędu

Logowanie do kont klientów z weryfikacja loginu i hasła 

- W momencie podania poprawnych danych logowania generowany jest `JWT token`, który jest przypisany do konkretnego konta, a na jego podstawie można określić jego szczegóły
- W przeciwny wypadku zwracany jest błąd i informacja o nim

Klasa `SecurityFilterChain` umożliwia zarządzanie dostępem do zasobów poprzez ustawienie konkretnych reguł

- Podczas próby wykorzytania zasobów o ograniczonym dostępie wymagany jest odpowiedni token, który identyfikuje klienta
- Próba dostępu może zostać przyznana albo odrzucona

W tym przypadku są dwie możliwości

- Nie zalogowany klient ma możliwość wejścia do widoku logowania, rejestracji, przywracania hasła oraz aktywacji konta z linku aktywacyjnego
- Zalogowany klient ma dostęp do reszty funkcjonalności

Aktualizowanie danych konta

Klient ma możliwość zmiany swoich danych oraz hasła w panelu klienta

- Dane i hasło mają osobne formularze do ich zmiany (dwa osobne kontrolery, które udostępniają zasoby do zmiany ich)
- Nowe dane osobowe należy zmienić w panelu klienta i zaakceptować przyciskiem
- Do zmiany hasła oprócz podania nowego i akceptacji przyciskiem należy podać stare hasło w celu weryfikacji
- Jeżeli hasła się zgadzają to zostaje zapisane nowe do bazy, a w przeciwnym wypadku zwrócona informacja z błędem

### `Książka adresowa`

W panelu klienta możliwe jest zarządzanie adresami dostaw 

- Adres można dodać podając jego informacje (miasto, ulica, kod pocztowy itp. )
- Wszystkie dane są wymagane, w innym przypadku zwracany jest błąd
- Wszystkie adresy przypisane do klienta wyświetlają się w zakładce "Książka adresowa"
- Istniejący adres można edytować poprzez formularz wprowadzając nowe dane
- Możliwe jest również usunięcie adresu

Aktualizowanie adresu, który jest przypisany do jakiegoś zamówienia powoduje stworzenie nowego adresu w książce adresowej, a adres zamówienia zostaje nie zmieniony

- Kontroler od aktualizacji sprawdza czy adres należy do jakiś zamówień
- Jeżeli tak to tworzony jest nowy adres, który zostaje przypisany do klienta, a połączenie ze starym adresem jest usuwane
- Jeżeli nie to dane zostają zmienione bez tworzenia nowego

Takie działanie powoduje to, że zmieniając adres w książce adresowej nie zmieniamy adresu zamówienia

Adres zamówienia można zmienić wykorzystując formularz w szczegółach zamówienia

- Jeżeli adres zamówienia jest taki sam jak ten z ksiązki adresowej, to obydwa ulegną zmianie
- Jeżeli zamówienie jest na adres nie przypisany do książki adresowej (przypadek kiedy klient zmienił wcześniejszy adres w książce adresowej, który należał do zamówienia) to zmienia się tylko adres zamówienia
- Zmiana adresu zakończonego zamówienia zwraca błąd

Jeżeli na adres jest już jakieś zamówienie to nie można go usunąć

### `Diety`

