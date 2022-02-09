function Section (container, name, chapters) {
  this.container = container;
  this.name = name;
  this.chapters = chapters;
  this.listFull = function () {
      for (var targetChapter = 0; targetChapter < this.chapters.length; targetChapter++) {
          console.log(this.name + " - " + this.chapters[targetChapter].innerText);
      }
  }
}

//Grab all li.presentation. Then make each into a section.
var sectionContainers = $("#toc-content li[role='presentation']:not([class])");
var sections = [];

for (var i = 0; i < sectionContainers.length; i++) {
  sections.push(
    new Section(
      sectionContainers[i],
      sectionContainers[i].querySelectorAll("h4.ga")[0].innerHTML, 
      sectionContainers[i].querySelectorAll("a.item-name.video-name.ga")
      )
    );
}

for (var i = 0; i < sections.length; i++) { 
  console.log(sections[i].listFull());
}