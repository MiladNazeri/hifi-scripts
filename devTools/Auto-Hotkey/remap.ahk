; Script to help remap your keyboard in a secondary mode
isOn := false
falseMessage := "NO"
trueMessage := "YES"
currentMessage := falseMessage
; CapsLock navigation
; Suspend means it's not runningSysGet, MonitorCount, MonitorCount
    ; Gui, 1: +AlwaysOnTop +Disabled -SysMenu +Owner -Caption ; +Owner avoids a taskbar button.
    ; Gui, 1: Add, Text,, %currentMessage%
    ; Gui, 1: Show, Center NoActivate, Title of Window  ; NoActivate avoids deactivating the currently active window.
Progress,1: B zh0 fs15 x874 y924 w80, %currentMessage%
Progress,2: B zh0 fs15 x2900 y924 w80, %currentMessage%

Suspend On
; Toggle suspense with Ctrl + 6
;^6::Suspend, toggle
^;::
; ToolTip, %isOn%
Suspend, toggle
isOn := !isOn
if isOn
    currentMessage := trueMessage
else
    currentMessage := falseMessage

Progress,1: B zh0 fs15 x874 y924 w80, %currentMessage%
Progress,2: B zh0 fs15 x2900 y924 w80, %currentMessage%

; SysGet, MonitorCount, MonitorCount
; SysGet, MonitorPrimary, MonitorPrimary
; Loop, %MonitorCount%
; {
;     SysGet, MonitorWorkArea, MonitorWorkArea, %A_Index%
;     ; MsgBox, Monitor:`t#%A_Index%`nName:`t%MonitorName%`nLeft:`t%MonitorLeft% (%MonitorWorkAreaLeft% work)`nTop:`t%MonitorTop% (%MonitorWorkAreaTop% work)`nRight:`t%MonitorRight% (%MonitorWorkAreaRight% work)`nBottom:`t%MonitorBottom% (%MonitorWorkAreaBottom% work)
;     ; Progress, b zh0 fs15 y%MonitorTop%, %currentMessage%
    
;     ControlSetText, Static1, %currentMessage%, currentStatus%MonitorCount%
; }
; SplashTextOn, 100, 100, status, %currentMessage%
; Progress, b zh0 fs15 y0, %currentMessage%
#Persistent
; CoordMode, ToolTip, Relative,
ToolTip, %currentMessage%
SetTimer, RemoveToolTip, -300
return

RemoveToolTip:
ToolTip
return

0::
Progress, 1: OFF
Progress, 2: OFF
return


; https://autohotkey.com/docs/KeyList.htm
; ` escape a character
; # Windows key
; + Shift
; ^ Ctrl
; ! Alt

; Arrow keys
i::Up
j::Left
k::Down
l::Right
,::^Left  ; This does control Left and right to skip between words = default windows function
.::^Right 

; Standard Navigation
u::Home
o::End
p::PgUp
`;::PgDn
4::^w

; Additonal function keys
n::Tab
h::Backspace
y::Delete
1::Esc

; cut copy and paste
c::^c 
v::^v
x::^x

; VS Code things
q::^+o ; opens up the symbols finder
w::^+[ ; fold
e::^+] ; unfold
g::^g ; Go to line
r::+!Down ; Copies the line down
z::^z ; undo
f::^f ; finds
7::+Up ; shift up to highlight above current line
8::+Down ; high light below
9::^+\ ; go to the end of the current bracket
a::+F12 ; find all references to the current high light
s::^s ; saves a file
d::^/ ; turns line into a comment
b::+!g ; Smart Grow
5::^d ; add the next occurance of highlighted item
2::^#!2 ; Git commit all
3::^b ; Files

t::Click
^t::Click, right
'::WheelUp
/::WheelDown
6::MouseMove, % A_CaretX, % A_CaretY
; ^i::MouseMove, 0, -20, 0, R  ; Win+UpArrow hotkey => Move cursor upward
; ^k::MouseMove, 0, 20, 0, R  ; Win+DownArrow => Move cursor downward
; ^j::MouseMove, -20, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
; ^l::MouseMove, 20, 0, 0, R  ; Win+RightArrow => Move cursor to the right
; +i::MouseMove, 0, -5, 0, R  ; Win+UpArrow hotkey => Move cursor upward
; +k::MouseMove, 0, 5, 0, R  ; Win+DownArrow => Move cursor downward
; +j::MouseMove, -5, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
; +l::MouseMove, 5, 0, 0, R  ; Win+RightArrow => Move cursor to the right
; !i::MouseMove, 0, -175, 0, R  ; Win+UpArrow hotkey => Move cursor upward
; !k::MouseMove, 0, 175, 0, R  ; Win+DownArrow => Move cursor downward
; !j::MouseMove, -175, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
; !l::MouseMove, 175, 0, 0, R  ; Win+RightArrow => Move cursor to the right
; 6::MouseMove, % A_CaretX, % A_CaretY
UP::MouseMove, 0, -40, 0, R  ; Win+UpArrow hotkey => Move cursor upward
DOWN::MouseMove, 0, 40, 0, R  ; Win+DownArrow => Move cursor downward
LEFT::MouseMove, -40, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
RIGHT::MouseMove, 40, 0, 0, R  ; Win+RightArrow => Move cursor to the right
^!UP::MouseMove, 0, -10, 0, R  ; Win+UpArrow hotkey => Move cursor upward
^!DOWN::MouseMove, 0, 10, 0, R  ; Win+DownArrow => Move cursor downward
^!LEFT::MouseMove, -10, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
^!RIGHT::MouseMove, 10, 0, 0, R  ; Win+RightArrow => Move cursor to the right
^UP::MouseMove, 0, -250, 0, R  ; Win+UpArrow hotkey => Move cursor upward
^DOWN::MouseMove, 0, 250, 0, R  ; Win+DownArrow => Move cursor downward
^LEFT::MouseMove, -250, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
^RIGHT::MouseMove, 250, 0, 0, R  ; Win+RightArrow => Move cursor to the right
