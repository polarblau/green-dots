(function() {
  $(function() {
    var $body, $failure, $focus, $output, $post, $pre, $prompt, $success, $test, CHAR_H, CHAR_W, OCD, PADDING, addChar, bbclrect, chars, cols, failed, focusInput, height, maxChars, rows, run, running, start, width, fnDelay, fnBoost, prompt;

    // fnDelay and fnBoost:
    //
    // JavaScript just can't go fast enough to mimic a good RSpec test
    // suite (10's-100's of specs/sec), and it can't hope to even *touch* a
    // minitest suite (100's-1000's of specs/sec). So fnDelay is the delay
    // between putting down the next bit of dots, which even set to 0
    // runs too slow for "good" RSpec or Minitest. So we add in
    // fnBoost, which is just a multiplier for how many dots we put
    // down at once, providing a visual acceleration (and probably
    // screwing up the viewport, bleh).

    var railsPrompt = 'bundle exec rake spec/';
    var rspecPrompt = 'rake spec/';
    var minitestPrompt = 'rake test';

    var fnRailsBoost = function () { return 1 };
    var fnRspecBoost = function () { return 4 };
    var fnMinitestBoost = function () { return 40 };

    // Rails-style rspec tends to be bog-slow on account of touching
    // fixtures and the database so much
    var fnRailsDelay = function() { return Math.random() > 0.9 ? 1000 : 30 };
    var fnRspecDelay = function() { return Math.random() > 0.99 ? Math.floor(Math.random() * Math.random() * 1000) : 0 };
    var fnMinitestDelay = function() { return 0 };

    prompt = railsPrompt;
    fnDelay = fnRailsDelay;
    fnBoost = fnRailsBoost;

    if (/rails/.test(location.search)) { prompt=railsPrompt; fnDelay = fnRailsDelay; fnBoost = fnRailsBoost; };
    if (/rspec/.test(location.search)) { prompt=rspecPrompt; fnDelay = fnRspecDelay; fnBoost = fnRspecBoost;};
    if (/minitest/.test(location.search)) { prompt=minitestPrompt; fnDelay = fnMinitestDelay; fnBoost = fnMinitestBoost;};

    $pre = $('#pre');

    $pre.val(prompt);

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
          progress += (new Array(1+fnBoost())).join('.');
        }
        chars += progress.length;
      }
      $output.append(progress);
      if (chars < maxChars) {
        delay = fnDelay();
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
