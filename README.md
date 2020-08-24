# ElBotDeLion

## Index
* [Info general](#info-general)
* [Hosting](#hosting)
* [BF4 Stats](#bf4-stats)
* [Recomendaciones](#recomendaciones)

## Info general
El Bot de Lion es un BOT de Discord buenísimo que estoy haciendo para el FApla.
Para hablarle el prefijo es `!` .

## Hosting
Está online pequeñas porciones de tiempo que mantengo el diminuto servidor online, pero si alguien más lo quiere hostear alcanza con bajar el repo y pedirme la Api Key de Discord *(no al bot, a mi verdadero yo)*.

## BF4 Stats
No existen *(que haya encontrado)* APIs funcionando a la fecha para levantar stats del Battlefield 4, así que el bot hace un laburo artesanal de 'extracción de información' de un servidor que actualiza la data aprox una vez al día.
La sintaxis para pedir stats es la siguiente:
```
!bf [stat (case sensitive)] [nickName del jugador]
```
... donde `stat` puede ser:
```
stats
btrScore
kills
deaths
assists
kd
games
wins
losses
winRate
rank
timePlayed
spm
flagCaptures
defendedFlags
heals
revives
headshots
shotsFired
accuracy
combatScore
shotsHit
avengerKills
saviorKills
killStreak
scoreGeneral
scoreTeam
scoreUnlock
scoreAward
scoreBonus
scoreSquad
weapons
topWeapons
score
```

## Recomendaciones
Con el poder de *TestDive* EbdL puede recomendarte películas, libros, música, videojuegos, etc. basado en una o más referencias del usuario.
La sintaxis para pedirle una recomendación es:
```
!recomendame [referencias (separadas por coma)] --[strict]
```
