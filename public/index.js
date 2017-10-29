var level = 0
var app = new Vue({
  el: '#app',
  data: {
    level: levels[level],
    manPosition: levels[level].map.man.concat(),
    isWin: 0,
    win: false,
    wall: `<img src="./imgs/wall.png" class="pics">`,
    floor: `<img src="./imgs/floor.png" class="pics">`,
    box: `<img src="./imgs/box.png" class="pics">`,
    man: `<img src="./imgs/man.png" class="pics">`,
    finish: `<img src="./imgs/finish.png" class="pics">`,
  },
  methods: {
    coord: function (index) {
      var x = Math.floor((index-1)/15);
      var y = index-15*x-1;
      return x+'-'+y;
    },
    move: function () {
      $('#begin').css('display','none');
      var self = this;
      $('body').keyup(function (eve) {
        if (self.win) {
          return;
        }
        var key = eve.which;
        switch (key) {
          case 37:
            console.log('left');
            self.go('left');
            break;
          case 38:
            console.log('up');
            self.go('up');
            break;
          case 39:
            console.log('right');
            self.go('right');
            break;
          case 40:
          console.log('down');
            self.go('down');
            break;
          default:
            break;
        }
      })
    },
    addFloor: function (self) {
      for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
          var ele = $('#'+i+'-'+j);
          if ($('#'+i+'-'+j+'>img').length==0) {
            $(ele).html(self.floor);
          } else {
            continue;
          }
        }
      }
    },
    go: function (direction) {
      var self = this;
      var thisP = '#'+(self.manPosition[0])+'-'+self.manPosition[1];
      var src1,src2;
      switch (direction) {
        case 'up':
          src1 = $('#'+(self.manPosition[0]-1)+'-'+self.manPosition[1]+'>img').attr('src');
          src2 = $('#'+(self.manPosition[0]-2)+'-'+self.manPosition[1]+'>img').attr('src');
          break;
        case 'left':
          src1 = $('#'+(self.manPosition[0])+'-'+(self.manPosition[1]-1)+'>img').attr('src');
          src2 = $('#'+(self.manPosition[0])+'-'+(self.manPosition[1]-2)+'>img').attr('src');
          break;
        case 'right':
          src1 = $('#'+(self.manPosition[0])+'-'+(self.manPosition[1]+1)+'>img').attr('src');
          src2 = $('#'+(self.manPosition[0])+'-'+(self.manPosition[1]+2)+'>img').attr('src');
          break;
        case 'down':
          src1 = $('#'+(self.manPosition[0]+1)+'-'+(self.manPosition[1])+'>img').attr('src');
          src2 = $('#'+(self.manPosition[0]+2)+'-'+(self.manPosition[1])+'>img').attr('src');
          break;
        default:
          break;
      }
      console.log(src1);
      if (src1 == './imgs/wall.png') {
        return;
      } else if (src1 =='./imgs/floor.png'||src1 == './imgs/finish.png') {
        if (self.finishP(thisP)) {
          $('#'+(self.manPosition[0])+'-'+self.manPosition[1]+'>img').attr('src','./imgs/finish.png');
        } else {
          $('#'+(self.manPosition[0])+'-'+self.manPosition[1]+'>img').attr('src','./imgs/floor.png');
        }
        switch (direction) {
          case 'up':
            self.manPosition[0]--;
            break;
          case 'left':
            self.manPosition[1]--;
            break;
          case 'right':
            self.manPosition[1]++;
            break;
          case 'down':
            self.manPosition[0]++;
            break;
          default:
            break;
        }
        $('#'+(self.manPosition[0])+'-'+self.manPosition[1]+'>img').attr('src','./imgs/man.png');
      } else if (src1 == './imgs/box.png') {
        if (src2 == './imgs/wall.png'||src2 == './imgs/box.png') {
          return;
        } else {
          if (self.finishP(thisP)) {
            $('#'+(self.manPosition[0])+'-'+self.manPosition[1]+'>img').attr('src','./imgs/finish.png');
          } else {
            $('#'+(self.manPosition[0])+'-'+self.manPosition[1]+'>img').attr('src','./imgs/floor.png');
          }
          switch (direction) {
            case 'up':
              self.manPosition[0]--;
              $('#'+(self.manPosition[0]-1)+'-'+self.manPosition[1]+'>img').attr('src','./imgs/box.png');
              break;
            case 'left':
              self.manPosition[1]--;
              $('#'+(self.manPosition[0])+'-'+(self.manPosition[1]-1)+'>img').attr('src','./imgs/box.png');
              break;
            case 'right':
              self.manPosition[1]++;
              $('#'+(self.manPosition[0])+'-'+(self.manPosition[1]+1)+'>img').attr('src','./imgs/box.png');
              break;
            case 'down':
              self.manPosition[0]++;
              $('#'+(self.manPosition[0]+1)+'-'+self.manPosition[1]+'>img').attr('src','./imgs/box.png');
              break;
            default:
              break;
          }
          $('#'+(self.manPosition[0])+'-'+self.manPosition[1]+'>img').attr('src','./imgs/man.png');
        }
      }
      self.win = self.judgeWin();
      if (self.win) {
        $('#win').css('display','block');
        $('#win').click(function () {
          window.opener=null;window.open('','_self');window.close();
        })
        return;
      }
    },
    finishP: function (id) {
      var self = this;
      var flag = false;
      self.level.map.finish[0].forEach(function (e,i) {
        if (id == '#'+e+'-'+self.level.map.finish[1][i]) {
          flag == true;
        }
      })
      return flag;
    },
    judgeWin: function () {
      var self = this;
      self.level.map.finish[0].forEach(function (e,i) {
        if ($('#'+e+'-'+self.level.map.finish[1][i]+'>img').attr('src') == './imgs/box.png') {
          self.isWin++;
        }
      })
      if (self.isWin == self.level.map.finish[0].length) {
        return true;
      } else {
        self.isWin = 0;
        return false;
      }
    },
  },
  mounted: function () {
    $('#win').css('display','none');
    var self = this;
    self.level.map.walls[0].forEach(function(e,i) {
      var currentID = e+'-'+self.level.map.walls[1][i];
      $('#'+currentID).html(self.wall);
    });
    self.level.map.finish[0].forEach(function(e,i) {
      var currentID = e+'-'+self.level.map.finish[1][i];
      $('#'+currentID).html(self.finish);
    });
    self.level.map.boxes[0].forEach(function (e,i) {
      var currentID = e+'-'+self.level.map.boxes[1][i];
      $('#'+currentID).html(self.box);
    })
    $('#'+self.level.map.man[0]+'-'+self.level.map.man[1]).html(self.man);
    self.addFloor(self);
  }
})