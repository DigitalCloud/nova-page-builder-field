import grapesjs from 'grapesjs';

export default grapesjs.plugins.add('custom', function (editor, opts) {

    var opt = opts || {};
    var config = editor.getConfig();
    var pfx = editor.getConfig().stylePrefix;
    var modal = editor.Modal;
    var $ = window.$ || grapesjs.$;

    config.showDevices = 0;

    var updateTooltip = function (coll, pos) {
        coll.each(function (item) {
            var attrs = item.get('attributes');
            attrs['data-tooltip-pos'] = pos || 'bottom';
            item.set('attributes', attrs);
        });
    }

    /****************** IMPORTER *************************/

    var codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
    var container = document.createElement('div');
    var btnImp = document.createElement('button');

    // Init import button
    btnImp.innerHTML = 'Import';
    btnImp.className = pfx + 'btn-prim ' + pfx + 'btn-import';
    btnImp.onclick = function () {
        var code = codeViewer.editor.getValue();
        editor.DomComponents.getWrapper().set('content', '');
        editor.setComponents(code.trim());
        modal.close();
    };

    // Init code viewer
    codeViewer.set({
        codeName: 'htmlmixed',
        theme: opt.codeViewerTheme || 'hopscotch',
        readOnly: 0
    });


    /****************** COMMANDS *************************/

    var cmdm = editor.Commands;
    cmdm.add('undo', {
        run: function (editor, sender) {
            sender.set('active', 0);
            editor.UndoManager.undo(1);
        }
    });
    cmdm.add('redo', {
        run: function (editor, sender) {
            sender.set('active', 0);
            editor.UndoManager.redo(1);
        }
    });
    cmdm.add('set-device-desktop', {
        run: function (editor) {
            editor.setDevice('Desktop');
        }
    });
    cmdm.add('set-device-tablet', {
        run: function (editor) {
            editor.setDevice('Tablet');
        }
    });
    cmdm.add('set-device-mobile', {
        run: function (editor) {
            editor.setDevice('Mobile portrait');
        }
    });
    cmdm.add('clean-all', {
        run: function (editor, sender) {
            sender && sender.set('active', false);
            if (confirm('Are you sure to clean the canvas?')) {
                var comps = editor.DomComponents.clear();
                setTimeout(function () {
                    localStorage.clear()
                }, 0)
            }
        }
    });

    cmdm.add('html-import', {
        run: function (editor, sender) {
            sender && sender.set('active', 0);

            var modalContent = modal.getContentEl();
            var viewer = codeViewer.editor;
            modal.setTitle('Import Template');

            // Init code viewer if not yet instantiated
            if (!viewer) {
                var txtarea = document.createElement('textarea');
                var labelEl = document.createElement('div');
                labelEl.className = pfx + 'import-label';
                labelEl.innerHTML = 'Paste here your HTML/CSS and click Import';
                container.appendChild(labelEl);
                container.appendChild(txtarea);
                container.appendChild(btnImp);
                codeViewer.init(txtarea);
                viewer = codeViewer.editor;
            }

            modal.setContent('');
            modal.setContent(container);
            codeViewer.setContent(
                '<div class="txt-red">Hello world!</div>' +
                '<style>\n.txt-red {color: red;padding: 30px\n}</style>'
            );
            modal.open();
            viewer.refresh();
        }
    });

    /****************** BLOCKS *************************/

    var bm = editor.BlockManager;

    bm.add('quote', {
        label: 'Quote',
        category: 'Basic',
        content: '<blockquote class="quote">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit</blockquote>',
        attributes: {class: 'fa fa-quote-right'}
    });

    bm.add('section-hero', {
        label: 'Hero section',
        category: 'Sections',
        content: `<style>
.clearfix{
  clear:both;
}
.header-banner{
  padding-top:35px;
  padding-bottom:100px;
  color:#ffffff;
  font-family:Helvetica, serif;
  font-weight:100;
  background-image:url("//grapesjs.com/img/bg-gr-v.png"), url("//grapesjs.com/img/work-desk.jpg");
  background-attachment:scroll, scroll;
  background-position:left top, center center;
  background-repeat:repeat-y, no-repeat;
  background-size:contain, cover;
}
.container-width{
  width:90%;
  max-width:1150px;
  margin:0 auto;
}
.logo-container{
  float:left;
  width:50%;
}
.logo{
  background-color:#fff;
  border-radius:5px;
  width:130px;
  padding:10px;
  min-height:30px;
  text-align:center;
  line-height:30px;
  color:#4d114f;
  font-size:23px;
}
        .menu{
  float:right;
  width:50%;
}
.menu-item{
  float:right;
  font-size:15px;
  color:#eee;
  width:130px;
  padding:10px;
  min-height:50px;
  text-align:center;
  line-height:30px;
  font-weight:400;
}
.lead-title{
  margin:150px 0 30px 0;
  font-size:40px;
}
.sub-lead-title{
  max-width:650px;
  line-height:30px;
  margin-bottom:30px;
  color:#c6c6c6;
}
.lead-btn{
  margin-top:15px;
  padding:10px;
  width:190px;
  min-height:30px;
  font-size:20px;
  text-align:center;
  letter-spacing:3px;
  line-height:30px;
  background-color:#d983a6;
  border-radius:5px;
  transition:all 0.5s ease;
  cursor:pointer;
}
.lead-btn:hover{
  background-color:#ffffff;
  color:#4c114e;
}
.lead-btn:active{
  background-color:#4d114f;
  color:#fff;
}
        </style>` + '<header class="header-banner"> <div class="container-width">' +
            '<div class="logo-container"><div class="logo">GrapesJS</div></div>' +
            '<nav class="navbar">' +
            '<div class="menu-item">BUILDER</div><div class="menu-item">TEMPLATE</div><div class="menu-item">WEB</div>' +
            '</nav><div class="clearfix"></div>' +
            '<div class="lead-title">Build your templates without coding</div>' +
            '<div class="lead-btn">Try it now</div></div></header>',
        attributes: {class: 'gjs-fonts gjs-f-hero'}
    });

    bm.add('section-badges', {
        label: 'Badges',
        category: 'Sections',
        content: `<style>.bdg-sect{
  padding-top:100px;
  padding-bottom:100px;
  font-family:Helvetica, serif;
  background-color:#fafafa;
}
.bdg-title{
  text-align:center;
  font-size:2em;
  margin-bottom:55px;
  color:#555555;
}
.badges{
  padding:20px;
  display:flex;
  justify-content:space-around;
  align-items:flex-start;
  flex-wrap:wrap;
}
.badge{
  width:290px;
  font-family:Helvetica, serif;
  background-color:white;
  margin-bottom:30px;
  box-shadow:0 2px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius:3px;
  font-weight:100;
  overflow:hidden;
  text-align:center;
}
.badge-header{
  height:115px;
  background-image:url("//grapesjs.com/img/bg-gr-v.png"), url("//grapesjs.com/img/work-desk.jpg");
  background-position:left top, center center;
  background-attachment:scroll, fixed;
  overflow:hidden;
}
.badge-name{
  font-size:1.4em;
  margin-bottom:5px;
}
.badge-role{
  color:#777;
  font-size:1em;
  margin-bottom:25px;
}
.badge-desc{
  font-size:0.85rem;
  line-height:20px;
}
.badge-avatar{
  width:100px;
  height:100px;
  border-radius:100%;
  border:5px solid #fff;
  box-shadow:0 1px 1px 0 rgba(0, 0, 0, 0.2);
  margin-top:-75px;
  position:relative;
}
.badge-body{
  margin:35px 10px;
}
.badge-foot{
  color:#fff;
  background-color:#a290a5;
  padding-top:13px;
  padding-bottom:13px;
  display:flex;
  justify-content:center;
}
.badge-link{
  height:35px;
  width:35px;
  line-height:35px;
  font-weight:700;
  background-color:#fff;
  color:#a290a5;
  display:block;
  border-radius:100%;
  margin:0 10px;
}</style><section class="bdg-sect">
  <div class="container-width">
    <h1 class="bdg-title">The team</h1>
    <div class="badges">
      <div class="badge">
        <div class="badge-header">
        </div>
        <img src="img/team1.jpg" class="badge-avatar"/>
        <div class="badge-body">
          <div class="badge-name">Adam Smith
          </div>
          <div class="badge-role">CEO
          </div>
          <div class="badge-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit
          </div>
        </div>
        <div class="badge-foot">
          <span class="badge-link">f</span>
          <span class="badge-link">t</span>
          <span class="badge-link">ln</span>
        </div>
      </div>
      <div class="badge">
        <div class="badge-header">
        </div>
        <img src="img/team2.jpg" class="badge-avatar"/>
        <div class="badge-body">
          <div class="badge-name">John Black
          </div>
          <div class="badge-role">Software Engineer
          </div>
          <div class="badge-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit
          </div>
        </div>
        <div class="badge-foot">
          <span class="badge-link">f</span>
          <span class="badge-link">t</span>
          <span class="badge-link">ln</span>
        </div>
      </div>
      <div class="badge">
        <div class="badge-header">
        </div>
        <img src="img/team3.jpg" class="badge-avatar"/>
        <div class="badge-body">
          <div class="badge-name">Jessica White
          </div>
          <div class="badge-role">Web Designer
          </div>
          <div class="badge-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit
          </div>
        </div>
        <div class="badge-foot">
          <span class="badge-link">f</span>
          <span class="badge-link">t</span>
          <span class="badge-link">ln</span>
        </div>
      </div>
    </div>
  </div>
</section>
`,
        attributes: {class: 'gjs-fonts gjs-f-h1p'}
    });
    //
    // bm.add('section-typography', {
    //     label: 'Text section',
    //     category: 'Sections',
    //     content: `<section class="bdg-sect">
    //   <h1 class="heading">Insert title here</h1>
    //   <p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
    //   </section>`,
    //     attributes: {class: 'gjs-fonts gjs-f-h1p'}
    // });
    //
    bm.add('section-cards', {
        label: 'Cards',
        category: 'Sections',
        content: `<style>
        .cards{
  padding:20px 0;
  display:flex;
  justify-content:space-around;
  flex-flow:wrap;
}
.card{
  background-color:white;
  height:300px;
  width:300px;
  margin-bottom:30px;
  box-shadow:0 1px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius:2px;
  transition:all 0.5s ease;
  font-weight:100;
  overflow:hidden;
}
.card:hover{
  margin-top:-5px;
  box-shadow:0 20px 30px 0 rgba(0, 0, 0, 0.2);
}
.card-header{
  height:155px;
  background-image:url("//placehold.it/350x250/78c5d6/fff/image1.jpg");
  background-size:cover;
  background-position:center center;
}
.card-header.ch2{
  background-image:url("//placehold.it/350x250/459ba8/fff/image2.jpg");
}
.card-header.ch3{
  background-image:url("//placehold.it/350x250/79c267/fff/image3.jpg");
}
.card-header.ch4{
  background-image:url("//placehold.it/350x250/c5d647/fff/image4.jpg");
}
.card-header.ch5{
  background-image:url("//placehold.it/350x250/f28c33/fff/image5.jpg");
}
.card-header.ch6{
  background-image:url("//placehold.it/350x250/e868a2/fff/image6.jpg");
}
.card-body{
  padding:15px 15px 5px 15px;
  color:#555;
}
.card-title{
  font-size:1.4em;
  margin-bottom:5px;
}
.card-sub-title{
  color:#b3b3b3;
  font-size:1em;
  margin-bottom:15px;
}
.card-desc{
  font-size:0.85rem;
  line-height:17px;
}

</style><div class="cards">
        <div class="card">
        <div class="card-header">
        </div>
        <div class="card-body">
          <div class="card-title">Title one
          </div>
          <div class="card-sub-title">Subtitle one
          </div>
          <div class="card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
        </div>
        <div class="card-body">
          <div class="card-title">Title two
          </div>
          <div class="card-sub-title">Subtitle one
          </div>
          <div class="card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
          </div>
        </div>
      </div>
      </div>`,
        attributes: {class: 'gjs-fonts gjs-f-3ba'}
    });

    bm.add('section-card', {
        label: 'Card',
        category: 'Sections',
        content: `<style>
        .cards{
  padding:20px 0;
  display:flex;
  justify-content:space-around;
  flex-flow:wrap;
}
.card{
  background-color:white;
  height:300px;
  width:300px;
  margin-bottom:30px;
  box-shadow:0 1px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius:2px;
  transition:all 0.5s ease;
  font-weight:100;
  overflow:hidden;
}
.card:hover{
  margin-top:-5px;
  box-shadow:0 20px 30px 0 rgba(0, 0, 0, 0.2);
}
.card-header{
  height:155px;
  background-image:url("//placehold.it/350x250/78c5d6/fff/image1.jpg");
  background-size:cover;
  background-position:center center;
}
.card-header.ch2{
  background-image:url("//placehold.it/350x250/459ba8/fff/image2.jpg");
}
.card-header.ch3{
  background-image:url("//placehold.it/350x250/79c267/fff/image3.jpg");
}
.card-header.ch4{
  background-image:url("//placehold.it/350x250/c5d647/fff/image4.jpg");
}
.card-header.ch5{
  background-image:url("//placehold.it/350x250/f28c33/fff/image5.jpg");
}
.card-header.ch6{
  background-image:url("//placehold.it/350x250/e868a2/fff/image6.jpg");
}
.card-body{
  padding:15px 15px 5px 15px;
  color:#555;
}
.card-title{
  font-size:1.4em;
  margin-bottom:5px;
}
.card-sub-title{
  color:#b3b3b3;
  font-size:1em;
  margin-bottom:15px;
}
.card-desc{
  font-size:0.85rem;
  line-height:17px;
}

</style>
        <div class="card" data-gjs-draggable=".cards">
        <div class="card-header"></div>
        <div class="card-body">
          <div class="card-title">Title one
          </div>
          <div class="card-sub-title">Subtitle one
          </div>
          <div class="card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
          </div>
        </div>
      </div>
      
      `,
        attributes: {class: 'gjs-fonts gjs-f-3ba'}
    });




    /****************** BUTTONS *************************/

    var pnm = editor.Panels;
    pnm.addButton('options', [{
        id: 'undo',
        className: 'fa fa-undo icon-undo',
        command: 'undo',
        attributes: {title: 'Undo (CTRL/CMD + Z)'}
    }, {
        id: 'redo',
        className: 'fa fa-repeat icon-redo',
        command: 'redo',
        attributes: {title: 'Redo (CTRL/CMD + SHIFT + Z)'}
    }, {
        id: 'import',
        className: 'fa fa-download',
        command: 'html-import',
        attributes: {title: 'Import'}
    }, {
        id: 'clean-all',
        className: 'fa fa-trash icon-blank',
        command: 'clean-all',
        attributes: {title: 'Empty canvas'}
    }]);

    // Add devices buttons
    var panelDevices = pnm.addPanel({id: 'devices-c'});
    var deviceBtns = panelDevices.get('buttons');
    deviceBtns.add([{
        id: 'deviceDesktop',
        command: 'set-device-desktop',
        className: 'fa fa-desktop',
        attributes: {'title': 'Desktop'},
        active: 1,
    }, {
        id: 'deviceTablet',
        command: 'set-device-tablet',
        className: 'fa fa-tablet',
        attributes: {'title': 'Tablet'},
    }, {
        id: 'deviceMobile',
        command: 'set-device-mobile',
        className: 'fa fa-mobile',
        attributes: {'title': 'Mobile'},
    }]);
    updateTooltip(deviceBtns);
    updateTooltip(pnm.getPanel('options').get('buttons'));


    /****************** EVENTS *************************/

    // On component change show the Style Manager
    editor.on('change:selectedComponent', function () {
        var openLayersBtn = editor.Panels.getButton('views', 'open-layers');

        // Don't switch when the Layer Manager is on or
        // there is no selected component
        if ((!openLayersBtn || !openLayersBtn.get('active')) &&
            editor.editor.get('selectedComponent')) {
            var openSmBtn = editor.Panels.getButton('views', 'open-sm');
            openSmBtn && openSmBtn.set('active', 1);
        }
    });

});
