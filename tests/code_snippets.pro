
;----------------------------------------------------------------------------
; things to fix in highlighting
;----------------------------------------------------------------------------
if this then $
  return else return 

self.latestLine = trace[-3].LINE   ;square bracket it captured by brackets, need new match for structures

;make sure that this doesn't get goofy from changing above
[(item).that:thing.this, this.that:that.this]

;----------------------------------------------------------------------------
; special control statement checks
;----------------------------------------------------------------------------
goto, gotojump ;comment
gotojump:
gotojump: ;comment

;----------------------------------------------------------------------------
; structures, including tag names. array indexing should have no tag color
;----------------------------------------------------------------------------
!NULL = { sName, $
  inherits obj2,$
  inherits obj3,$
  prop: this,$
  prop2: that.else $
}
output_combinations = {MINS: mins.toArray, MAXS: maxs.toArray()}

;get the indices that we will mate
!NULL = idxSort[-nMutate:-nMutate]
idxSort[nRandom:nRandom-1]
!NULL = idxSort[nRandom:nRandom-1, r:nrandom]
;----------------------------------------------------------------------------
; executive commands
;----------------------------------------------------------------------------
.edit
.edit ;with comment
.compile 'C:\some\file'
.fu
.reset

;----------------------------------------------------------------------------
; accessing/settings properties
;----------------------------------------------------------------------------
self.passed = 0
return, isa(self.value[0], /STRING)
this = (this()).prop.prop.prop
this = this.prop.prop.prop
!NULL = self.prop
if ~self.debug then on_error,2
5+ this.that
- this.that
ne this.that
temp = 2^this.that
5*(this.that/this.else)/(this.that/this.else)
[(item).that:thing.this, this.that:that.this]
this.that = item.property
print, this.prop
!NULL = this(this.prop)
print, !COLOR.BLACK
!this.that = 5
!COLOR.BLACK
5 # this.that
5 ## this.that
ne= this.that
val = (item.res()).property
mm = ij ? jm.duh : im.this

something, $
  this,$
  ;comments here
  something

;----------------------------------------------------------------------------
; routines, procedure or function with and without args
;----------------------------------------------------------------------------
generateccamsClassifier_getCombinati2ons() ;comment
generateOccamsClassifier_getCombinations, $ ;comment
  this, that,$ ;comment
  something

anyNameHere, clogs.th,$  ;comment
  ;comment and still line continuation
  procedurehere,$
  andHere

print,$
  ;comment here for fanciness
  false_positive.this(),$
  andthis(),$
  nothing, $
  procedure
  
procedure,asfdg, $
  somethingelse.this

procedure, $
  ;comment
  somethingelse,$
  thing.that,

file_mkdir, self.buildDir
if (space_after) then printf, lun, '', /IMPLIED_PRINT
repeat print, !NULL until (stmnt) 
if (this) then print, thiat else if (thing) then print, this else that = 5
if (!TRUE) then print, !TRUE else print, !FALSE
if keyword_set(space_before) AND ~keyword_set(log_only) then begin
  print
end
for i=0,9 do print ;something
if (this) then return else on_error,2
function some
function some::withmethod
pro some
pro some::withmethod
if (ISA(name) && ~ISA(identifier)) then identifier
idxEnd = where(strpos(trim, com + hEnd) eq 0, countEnd)

;to get these, practically need to copy/paste procedure rules
of
  (stmnt): print, this.that(), something->else() ;comment
  (stmnt): print ;comment
  "ERASE": slicer_erase
endcase

;to get these, practically need to copy/paste procedure method rules
;in the switch-case-block capture group, at least it is colored?
case (1) of
  (stmnt): begin
    (item).method, this ;comment
  end
  (stmnt): (item.this()).method, ;comment
  (stmnt): item.method, this ;commet
  (stmnt): item.method ;commetn
endcase

;----------------------------------------------------------------------------
; invoking methods, procedure or function with and without args
;----------------------------------------------------------------------------
void = self->parent::method()
self->parent::method,
self->method 
self->method,
oVis[i]->_IDLitVisualization::SetProperty, GROUP_PARENT=self
oVis[iOk[i]]->_IDLitVisualization::SetProperty, GROUP_PARENT=obj_new()
self.this
self.this,
void = self.method()
self.luna_test._failed ;comment
self.luna_test._failed, this.that ;comment
(self.luna_test)._failed.this.that, andthis.that ;comment
(self.luna_test)._failed.this.that  ;comment
(self.luna_test)._failed.this.that() 
strings.add, self.luna_test.luna_suite.luna._generateFancyString(msg, self.flags[midx], FANCY = fancy) ;comment
(it.expects()).toBeNull
(it.expects(5)).toBeNull, /_EXPECT_FAILURE
(it.expects())._not_.toBeNull, /_EXPECT_FAILURE
(it.expects(5))._not_.toBeNull
(it.expects()).toBeNull()   ;comment
(it.expects(5)).toBeNull(/_EXPECT_FAILURE)
(it.expects())._not_.toBeNull(/_EXPECT_FAILURE) ;comment
(it.expects(5))._not_.toBeNull()

foreach line, lines do newStrings->Add, line
for i=0,9 do this.Add, if else something.Add, 42
if ~trimFirst.startsWith('```') then newStrings.Add, '```'
if ~trimFirst.startsWith('```') then (newStrings).Add, '```'
repeat newStrings.Add, '```'
foreach line, lines do newStrings.Add, line
foreach line, lines do newStrings->Add, line
end

end


