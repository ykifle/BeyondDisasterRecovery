{{! template for a smart list }}
<div class="status">
  <div class="health info">
    <h3>Healthy</h3>
    <h4>Yes</h4>
  </div>
  <div class="source info">
    <h3>Soure Path</h3>
    <h4>svm_env2:dest</h4>
  </div>
  <div class="dest info">
    <h3>Destination Path</h3>
    <h4>svm_env1:src</h4>
  </div>
  <div class="mirror info">
    <h3>Mirror State</h3>
    <h4>Snapmirrored</h4>
  </div>
  <div class="relate info">
    <h3>Relation Status</h3>
    <h4>Idle</h4>
  </div>
</div>
<div class="edit-container">
<h3>Change Master</h3>
<button class="west-master wsite-button master-button" disabled>West</button>
<button class="east-master wsite-button master-button" disabled>East</button>
  <div class="edit-overlay hidden">
    <img src="{{assets_path}}ring.gif"/>
  </div>
</div>
<textarea class="output">
</textarea>