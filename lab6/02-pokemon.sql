create table pokemon
(
    id      integer not null
        constraint pokemon_pk
            primary key autoincrement,
    name    text not null,
    type    text not null
);