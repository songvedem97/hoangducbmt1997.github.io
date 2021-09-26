
const audio = document.getElementById('audio');
const lyricContainer = document.getElementById('lyric');

function parseLyric(text) {
    //Tách văn bản thành từng dòng và lưu trữ nó trong một mảng
    var lines = text.split('#'),
        pattern = /\[\d{2}:\d{2}.\d{2,3}\]/g,
        result = [];
    while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function (v /*Giá trị phần tử mảng*/, i /*chỉ số phần tử*/, a /*Mảng chính*/) {
        var time = v.match(pattern),
            value = v.replace(pattern, '');
        time.forEach(function (v1, i1, a1) {
            var t = v1.slice(1, -1).split(':');
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        });
    });
    //Sắp xếp theo kích thước thời gian
    result.sort(function (a, b) {
        return a[0] - b[0];
    });
    return result;
}


getLrc = function () {
    $.ajax({
        type: "get",
        url: "co-hen-voi-thanh-xuan-MONSTAR.lrc",
        dataType: "text",
    })
        .done(function (data) {
            var text = data,
                text = text.replace(/\n/g, '#').replace(/\r/g, '').replace(/######/g, '#').replace(/######/g, '#').replace(/####/g, '#').replace(/###/g, '#').replace(/##/g, '#');
            lyric = parseLyric(text);
            appendLyric(lyric);

        })
        .fail(function () {
            alert("Cannot load lyric");
        });

},
    appendLyric = function (lyric) {
        lyric.forEach(function (v, i, a) {
            $("<p id='line-" + i + "'>").html(v[1]).appendTo(".lyric");
        });
    },
    scrollbar = function () {
        var line = $(".current-line"),
            scrolltop = $(".lyric").scrollTop(),
            anchor = line.offset().top;
        $(".lyricwrap").animate({
            scrollTop: anchor
        }, 1000, 'swing');
        if (anchor - 80 != scrolltop) {
            if (line.length && anchor >= 80) {
                $(".lyricwrap").animate({
                    scrollTop: anchor - 80
                }, 1000, "swing");
            }
        }
    };

getLrc();

audio.addEventListener('timeupdate', function (e) {
    for (var i = 0, l = lyric.length; i < l; i++) {
        if (this.currentTime > lyric[i][0]) {
            var prevLine = $("#line-" + (i > 0 ? i - 1 : i) + ""),
                line = $("#line-" + i + ""),
                lineClass = $(".current-line").attr("id"),
                anchor = line.position().top;
            $(".current-line").attr("class", "");
            line.attr("class", "current-line");
            $(".lyric").css("top", "" + (80 - line.position().top) + "px");
            if (lyric[i][1] !== '') {
                document.title = lyric[i][1];
            } else {
                document.title = 'Goodbye';
            }
        }
    }

}, false);

