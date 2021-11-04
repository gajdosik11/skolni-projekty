$(function() 
{

    function setCookie(jmeno, hodnota, den) 
    {
        if (den) 
        {
            var datum = new datum();
            datum.setTime(datum.getTime() + (den * 24 * 60 * 60 * 1000));
            var konec = '; konec=' + datum.toGMTString();
        }
        else var konec = '';
        document.cookie = jmeno + '=' + hodnota + konec + '; path=/';
    }

    function getCookie(jmeno) 
    {
        var stejne = jmeno + '=';
        var pom = document.cookie.split(';');
        for (var i = 0; i < pom.length; i++) 
        {
            var c = pom[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(stejne) === 0) return c.substring(stejne.length,
                c.length);
        }
        return null;
    }

    function removeCookie(jmeno) 
    {
        setCookie(jmeno, '', -1);
    }

    $('.home #services-cards .card .card-body').find('a').each(function(i, blok) 
    {
        var vybranyBlok = '.card-' + (i + 1) + ' .more-content';
        var cookie = getCookie(vybranyBlok);
        if (cookie === 'isToggled') 
        {
            $(vybranyBlok).toggleClass('hidden');
            blok.innerText = 'méně';
        }
    });

    $('.home #services-cards .card .card-body').find('a').each(function(i, blok) 
    {
        blok.addEventListener('click', function() 
        {
            var vybranyBlok = '.card-' + (i + 1) + ' .more-content';
            $(vybranyBlok).toggleClass('hidden');

            if ($(vybranyBlok).hasClass('hidden')) 
            {
                removeCookie(vybranyBlok);
                blok.innerText = 'více';
            } else 
            {
                setCookie(vybranyBlok, 'isToggled', 100);
                blok.innerText = 'méně';
            }
        });
    });

    $("a.group").fancybox(
    {
        'transitionIn'	:	'elastic',
        'transitionOut'	:	'elastic',
        'speedIn'		:	600,
        'speedOut'		:	200,
        'overlayShow'	:	false
    });
});

