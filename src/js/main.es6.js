"use strict";

var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "samroelants", "ssrroo"];

$(function () {
    var $search = $('.menu-search');
    var $expand = $('.expand');
    var $searchbar = $('.searchbar');
    var $close = $('.close');

    var $menu_all = $('.menu-all');
    var $menu_online = $('.menu-online');
    var $menu_offline = $('.menu-offline');

    var $channels = $('.channels');

    // Search bar

    $expand.click(function () {
        $search.addClass('search-expanded');
        $searchbar.addClass("searchbar-expanded");
        $expand.removeClass('expand');
        $searchbar.focus();
        $searchbar.val('');
        $close.fadeIn();
    });
    $close.click(function () {
        $search.removeClass('search-expanded');
        $searchbar.removeClass("searchbar-expanded");
        $expand.addClass('expand');
        $('.active').trigger("click");
        $close.fadeOut(200);
    });

    // Search functionality

    $searchbar.on('keyup change', function (e) {
        $('.channels li').each(function (i, el) {
            var name = $(el).find('.display-name').html().toLowerCase();
            var searchstring = $searchbar.val().toLowerCase();
            if (name.includes(searchstring)) $(el).show();else $(el).hide();
        });
    });

    $('.menu form').submit(function (e) {
        e.preventDefault();
    });

    // Online/Offline functionality

    $menu_all.click(function () {
        $('.menu .active').removeClass('active');
        $menu_all.addClass('active');
        $('.channels li').show();
    });

    $menu_online.click(function () {
        $('.menu .active').removeClass('active');
        $menu_online.addClass('active');
        $('.channels li.online').show();
        $('.channels li:not(.online)').hide();
    });

    $menu_offline.click(function () {
        $('.menu .active').removeClass('active');
        $menu_offline.addClass('active');
        $('.channels li.online').hide();
        $('.channels li:not(.online)').show();
    });

    // Getting Twitch information
    function getChannel(channel) {
        return Promise.resolve($.ajax({
            method: 'GET',
            url: "https://api.twitch.tv/kraken/channels/" + channel,
            headers: {
                'Client-ID': 'qol1fx3l80fnvl8enjmhps40m2po3mv'
            }
        }));
    }

    // Create a Channel entry

    function addChannelEntry(data) {
        if (data.logo === null) {
            data.logo = "img/generic.png";
        }
        var html = "\n          <a href=" + data.url + " target=\"_blank\">\n              <li id=\"" + data.name + "\">\n                  <img alt=\"" + data.name + " avatar\" src=\"" + data.logo + "\">\n                    <div>\n                      <div class=\"display-name\">" + data.display_name + "</div>\n                      <div class=\"status\"></div>\n                    </div>\n                </li>\n            </a>";
        $channels.append(html);
        return data.name;
    }

    function addGenericChannel(data) {
        var logo = "img/generic.png";
        var name = data.responseJSON.message.split(" ")[1].replace(/'/g, "");
        var html = "<li id=\"generic\">\n              <img alt=\"generic avatar\" src=\"" + logo + "\">\n                <div>\n                  <div class=\"display-name\">" + name + "</div>\n                  <div class=\"status\">" + data.responseJSON.message + "</div>\n                </div>\n            </li>";
        $channels.append(html);
        return null;
    }

    function checkStatus(channel) {
        function checkStream(data) {
            if (data.stream != null) {
                $('#' + channel).addClass('online');
                $('#' + channel + ' .status').html('Streaming ' + data.stream.game);
            }
        }
        var stream = Promise.resolve($.ajax({
            method: 'GET',
            url: "https://api.twitch.tv/kraken/streams/" + channel,
            headers: {
                'Client-ID': 'qol1fx3l80fnvl8enjmhps40m2po3mv'
            }
        }));
        stream.then(checkStream);
    }

    var promises = channels.map(getChannel);
    promises.forEach(function (p) {
        return p.then(addChannelEntry).catch(addGenericChannel).then(checkStatus);
    });
});