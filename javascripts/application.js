(function() {
  $(function() {
    var $body, $failure, $focus, $output, $post, $pre, $prompt, $success, $test, CHAR_H, CHAR_W, OCD, PADDING, addChar, bbclrect, chars, cols, failed, focusInput, height, maxChars, rows, run, running, start, width;

    $pre = $('#pre');
    $post = $('#post');
    $failure = $('#failure');
    $success = $('#success');
    $output = $('#output');
    $prompt = $('#prompt');
    $focus = $('#focus');
    $body = $('body');
    $test = $('#test span');
    bbclrect = $test.get(0).getBoundingClientRect();
    CHAR_W = bbclrect.width;
    CHAR_H = bbclrect.height;
    PADDING = 20;
    OCD = /OCD/.test(location.search);
    $test.parent().remove();
    height = $body.height() - PADDING * 2 - $pre.height() - $post.height();
    if (OCD) {
      height -= $failure.height();
    }
    if (!OCD) {
      height -= $success.height();
    }
    width = $output.width();
    cols = Math.floor(width / CHAR_W);
    rows = Math.floor(height / CHAR_H);
    maxChars = cols * rows - Math.round(Math.random() * (cols / 2));
    running = false;
    failed = false;
    chars = 0;
    start = (new Date).getTime();
    addChar = function() {
      var $result, batch, delay, duration, progress;

      progress = '';
      if (OCD && !failed && maxChars - chars < Math.random() * 10) {
        failed = true;
        progress = '<span class="failure">F</span>';
        chars++;
      } else {
        batch = Math.floor() > 0.6 ? Math.floor(Math.random() * 10) : 1;
        while (batch-- !== 0) {
          progress += '.';
        }
        chars += progress.length;
      }
      $output.append(progress);
      if (chars < maxChars) {
        delay = Math.random() * (Math.random() > 0.9 ? 1000 : 30);
        return setTimeout(addChar, delay);
      } else {
        $result = failed ? (duration = ((new Date).getTime() - start) / 1000, $failure) : $success;
        $result.show().find('span.examples').text(chars).end().find('span.time').text(duration);
        running = false;
        return focusInput($post.show());
      }
    };
    run = function() {
      $pre.blur();
      addChar();
      return running = true;
    };
    focusInput = function($input) {
      var initVal;

      initVal = $input.val();
      return $input.focus().val(initVal);
    };
    $pre.on('keydown', function(e) {
      e.preventDefault();
      if (e.which === 13) {
        return run();
      }
    });
    $focus.on('click', function() {
      if (running) {
        return;
      }
      if ($post.is(':visible')) {
        return focusInput($post);
      } else {
        return focusInput($pre);
      }
    });
    return focusInput($pre);
  });

}).call(this);

/*
//@ sourceMappingURL=application.js.map
*/
