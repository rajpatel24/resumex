import React from "react";
import {  Button, Typography } from '@mui/material';

function PrintButton({ refsToPrint }) {
  
  //--------------------Functions---------------------------------

  const deepCloneWithStyles = (node) => {
    const style = document.defaultView.getComputedStyle(node, null);
    const clone = node.cloneNode(false);
    if (clone.style && style.cssText) clone.style.cssText = style.cssText;
    for (let child of node.childNodes) {
      if (child.nodeType === 1) clone.appendChild(deepCloneWithStyles(child));
      else clone.appendChild(child.cloneNode(false));
    }
    return clone;
  };

  const printFunction = () => {
    const printWindow = window.open("", "", "height=400,width=800");
    printWindow.document.write(
      "<html><head><title>Page Title</title></head><body id='print-body'>"
    );
    const body = printWindow.document.getElementById("print-body");
    refsToPrint.map((ref) => {
      const clone = deepCloneWithStyles(ref.current);
      return body.appendChild(clone);
    });
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  }; 


  return <Button 
                 style={{float: "right" ,fontWeight: "bold", padding: "10px", borderRadius: "10px", color: "white", backgroundColor: "#00AB55", margin: "10px", fontSize: "medium"}} 
                 onClick={printFunction}> Generate PDF 
        </Button>;
}

export default PrintButton;