import { Directive, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Directive({
  selector: '[appBubbleGraph]',
  inputs: ['width', 'height']
})
export class BubbleGraphDirective {

  height : number;
  width : number;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    let svg = d3.select('#'+this.el.nativeElement.id),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    let format = d3.format(",d");

    let color = d3.scaleOrdinal(d3.schemeCategory20c);

    let pack = d3.pack()
        .size([width, height])
        .padding(1.5);

    d3.csv("assets/flare.csv", (d: any) => {
      d.value = +d.value;
      if (d.value) return d;
    }, (error, classes) => {
      if (error) throw error;

      var root = d3.hierarchy({children: classes})
          .sum((d : any) => { return d.value; })
          .each((d : any) => {
            if (id = d.data.id) {
              var id, i = id.lastIndexOf(".");
              d.id = id;
              d.package = id.slice(0, i);
              d.class = id.slice(i + 1);
            }
          });

      var node = svg.selectAll(".node")
        .data(pack(root).leaves())
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", (d : any) => { return "translate(" + d.x + "," + d.y + ")"; });

      node.append("circle")
          .attr("id", (d : any) => { return d.id; })
          .attr("r", (d : any) => { return d.r; })
          .style("fill", (d : any) => { return color(d.package); });

      node.append("clipPath")
          .attr("id", (d : any) => { return "clip-" + d.id; })
        .append("use")
          .attr("xlink:href", (d : any) => { return "#" + d.id; });

      node.append("text")
          .attr("clip-path", (d : any) => { return "url(#clip-" + d.id + ")"; })
        .selectAll("tspan")
        .data((d : any) => { return d.class.split(/(?=[A-Z][^A-Z])/g); })
        .enter().append("tspan")
          .attr("x", 0)
          .attr("y", (d, i, nodes) => { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
          .text((d : any) => { return d; });

      node.append("title")
          .text((d) => { return d.id + "\n" + format(d.value); });
    });

  }

}
