; Script to help remap your keyboard in a secondary mode
Suspend On

isFlashOn := true
isOn := false
msgOn := "Y"
msgOff := "N"
currentMessage := msgOff
baseCapsLockMessage := "Caps:"
capsLockStatus := 0
fontSize := 175
caplockState := baseCapsLockMessage + msgOff

if (isFlashOn){
    SysGet, MonitorCount, MonitorCount
    Loop, %MonitorCount%
    {
        SysGet, MonitorName, MonitorName, %A_Index%
        SysGet, Monitor, Monitor, %A_Index%
        SysGet, MonitorWorkArea, MonitorWorkArea, %A_Index%
        centerHorizontal := (Abs(MonitorRight) + Abs(MonitorLeft)) / 2 + MonitorLeft
        centerVertical := (Abs(MonitorTop) + Abs(MonitorBottom)) / 2 + MonitorTop
        CustomColor := "000000"  ; Can be any RGB color (it will be made transparent below).
        Gui, %A_Index%: +LastFound +AlwaysOnTop -Caption +ToolWindow ; +ToolWindow avoids a taskbar button and an alt-tab menu item. 
        Gui, %A_Index%: Color, %CustomColor%
        Gui, %A_Index%: Font, w1000 s%fontSize% cFFFFFF ; Set a large fount size (32-point).
        Gui, %A_Index%: Add, Text, v%A_Index% GuiMove, % currentMessage
        Gui, %A_Index%: Show, x%centerHorizontal% y%centerVertical%, %A_Index%
        WinSet, Transparent, 1
        WinSet, TransColor, %CustomColor%

    }
}

NEWCOLOR := "Red"
CapsLock & `;::
^`;::
Suspend, toggle
isOn := !isOn
if (isOn){
    currentMessage := msgOn
    NEWCOLOR := "Green"
} else {
    currentMessage := msgOff
    NEWCOLOR := "Red"
}

if (isFlashOn){
    SysGet, MonitorCount, MonitorCount
    Loop, %MonitorCount%
    {
        GuiControl,%A_Index%: , %A_Index%, % currentMessage
        Gui, %A_Index%: Font, c%NEWCOLOR%
        GuiControl, %A_Index%: Font, %A_Index%
    }
}


#Persistent
ToolTip, %currentMessage%
SetTimer, RemoveToolTip, -400
return

RemoveToolTip:
ToolTip
return

uiMove:
PostMessage, 0xA1, 2,,, A 
Return

0::
Progress, 1: OFF
Progress, 2: OFF
return

^0::
    SysGet, MonitorCount, MonitorCount
    Loop, %MonitorCount%
    {
        Gui, %A_Index%: Show, Hide
    }
return

^9::
    SysGet, MonitorCount, MonitorCount
    Loop, %MonitorCount%
    {
        Gui, %A_Index%: Show
    }
return

^#!8::
fontSize -= 5
SysGet, MonitorCount, MonitorCount
Loop, %MonitorCount%
{
    Gui, %A_Index%: Font, s%fontSize%
    GuiControl, %A_Index%: Font, %A_Index%
}
return

^#!9::
fontSize += 5
SysGet, MonitorCount, MonitorCount
Loop, %MonitorCount%
{
    Gui, %A_Index%: Font, s%fontSize%
    GuiControl, %A_Index%: Font, %A_Index%
}
return

6::
FileRead, FileContents, %A_WorkingDir%\snippets.txt
Gui, 3: Font, s16, Verdana
Gui, 3: +AlwaysOnTop -Caption +ToolWindow 
Gui, 3: Add, Text,gClose, %FileContents% 
Gui, 3: SHOW, xCenter yCenter
return

Close:
Gui, 3: Destroy
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

; Additonal function keys
n::Tab
h::Backspace
y::Delete
1::Esc
4::^w ; close window

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
^w::^#!w ; Fold region 1
^#!Up::^!#7 ; Previous symbol
^#!Down::^!#8 ; Next symbol

t::Click
^t::Click, right
'::WheelUp
/::WheelDown
; 6::MouseMove, % A_CaretX, % A_CaretY
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





; Suspend means it's not runningSysGet, MonitorCount, MonitorCount
    ; Gui, 1: +AlwaysOnTop +Disabled -SysMenu +Owner -Caption ; +Owner avoids a taskbar button.
    ; Gui, 1: Add, Text,, %currentMessage%
    ; Gui, 1: Show, Center NoActivate, Title of Window  ; NoActivate avoids deactivating the currently active window.
; Progress,2: B zh0 fs15 x2900 y924 w80, %currentMessage%