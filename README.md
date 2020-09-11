# ElBotDeLion

## Index
* [Info general](#info-general)
* [Hosting](#hosting)
* [BF4 Stats](#bf4-stats)
* [Recomendaciones](#recomendaciones)
* [Azar](#azar)
* [Score](#score)/puntaje


## Info general
El Bot de Lion es un BOT de Discord buenísimo que estoy haciendo para el FApla.
Para hablarle el prefijo es `!` .


## Hosting
Está online pequeñas porciones de tiempo que mantengo el diminuto servidor online, pero si alguien más lo quiere hostear alcanza con bajar el repo y pedirme la Api Key de Discord *(no al bot, a mi verdadero yo)*.
Si está online podés ver quién lo está hosteando con el comando `host`.
Con los comandos `version` o `v` podés verificar qué versión se está ejecutando.


## BF4 Stats
No existen *(que haya encontrado)* APIs funcionando a la fecha para levantar stats del Battlefield 4, así que el bot hace un laburo artesanal de 'extracción de información' de un servidor que actualiza la data aprox una vez a la semana.

Para actualizarla manualmente podés ingresar el siguiente comando:
```
!bf update [nickName del jugador]
```

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

EbdL puede designar un líder de squad mediante un algorítmo cósmico. Ingresá esta línea para pedírselo:
```
!bf leader [jugadores (separados por espacio)]
```


## Recomendaciones
Con el poder de *TestDive* EbdL puede recomendarte películas, libros, música, videojuegos, etc. basado en una o más referencias del usuario. Puede generar hasta 5 recomendaciones randómicas en función de tus referencias, de modo que puedas pedírselo más de una vez para ver resultados diferentes.
La sintaxis para pedirle una recomendación es:
```
!recomendame [referencias (separadas por coma)] --[strict (opcional)]
```


## Azar
Si no estás seguro de algo podés apostarlo al azar con EbdL:
* `!dado/dice` para girar un dado.
* `!moneda/coin/flip` para lanzar una moneda.
* `!bola8/8ball [pregunta]` para preguntarle a la mística bola 8.


## Score
Mientras esté hosteado, EbdL almacena en un objeto global el puntaje para los participantes de los juegos de casino. El mismo se reestablece al reiniciar el servidor, o al modificar el hosteo del bot. Podés utilizar los siguientes comandos:
* `!score/puntaje` para ver tu puntaje.
* `!scores/puntajes` para ver todos los puntajes almacenados.
* `!score/puntaje [integer]` para establecer tu puntaje.
* `!score/puntaje +/-[integer]` para modificar tu puntaje.


## Slots
Con EbdL podés jugar a las maquinitas, claro! Los comandos para hacerlo son:
* `!maquinita/slots` para hacer un tiro de prueba.
* `!maquinita/slots [integer]` para apostar una parte de tu score.

Al igual que en los slots originales la jugada siempre va de izquierda a derecha. Algunas figuras tienen multipliers, que permiten que no pierdas toda tu apuesta *(o incluso saques alguna ventaja)* aún sin armar juego. Los juegos se forman con 2 o 3 figuras iguales.


## Poker
Entre los múltiples oficios del bot, uno de los más destacados es el de croupiere. El prefijo para todo lo relacionado al juego es `pkr`.

Para comenzar una partida ingresá:
```
!pkr nuevo/new [integer (opcional)]
```
... donde `[integer]` puede ser un número del 1 al 52, indicando la cantidad de cartas deseadas en la baraja *(por defecto 52)*.

Para que reparta una mano de póker abierto (Texas Hold'em), en orden 3 / 1 / 1, podés utilizar:
```
!pkr reparti/flop/turn/river
```
... él sabe qué hacer.

Para pedirle cartas la sintaxis es:
```
!pkr dame/deal [integer]
```
... donde `[integer]` es la cantidad de cartas *(siempre y cuando aún queden en el mazo)*.


Para apostar puntos de tu score global, podés ingresar en cualquier momento:
```
!pkr bet/+ [integer]
```
... donde `[integer]` es la cantidad de puntos. Este puntaje será descontado de tu score y se sumará al pozo de la mano, que se le asignará al ganador.

Para terminar la vuelta basta con que el ganador ingrese:
```
!pkr win/gane
```

Otros comandos de éste módulo que pueden ingresarse después del prefijo `!pkr` son:
* `hand/mano` para recordar tu mano.
* `hands/manos` para recordar todas las manos.
* `fold/chau/mevoy/lovemo` para irte al mazo *(Aún así tu apuesta seguirá en juego)*.
* `show/muestro/mostrar` para mostrar tu mano boca arriba.
* `bet/apuesta` para recordar tu apuesta.
* `bets/apuestas` para recordar todas las apuestas.
* `deck/mazo` para ver todas las cartas restantes del mazo *(El bot mezclará automáticamente después de mostrarlas)*.
* `shuffle/mezcla/mezclar` para volver a mezclar un mazo sospechoso.


## Idioma
Como buen bot, EbdL es plíglota. Pedile alguna frase en otro idioma para culturizarte ingresando `!idioma`.


## Profecia
Dudás sobre lo que los dioses deparan para vos en las próximas horas? Podés pedir por una `!profecia`.


## Filosofia
El bot es pensador y filósofo. Ingresando `!filosofia` tendrá la frase adecuada para hacerte reflexionar en profundidad acerca de la propia existencia.
