(module
 (type $0 (func (param i32) (result f32)))
 (type $1 (func (param i32) (result i32)))
 (type $2 (func (param i32 i32)))
 (type $3 (func (param i32 i32) (result i32)))
 (type $4 (func (param i32 f32 f32 f32 f32)))
 (type $5 (func (param i32 i32 i32 i32)))
 (type $6 (func (param i32 i32 i64)))
 (type $7 (func))
 (type $8 (func (param f32) (result f32)))
 (type $9 (func (param i32 f32 f32 f32)))
 (type $10 (func (param i32 f32 f32)))
 (type $11 (func (param i32 f32)))
 (type $12 (func (param i32 f32 f32 f32 f32 f32)))
 (type $13 (func (param i32)))
 (type $14 (func (param f32 f32) (result f32)))
 (type $15 (func (result f32)))
 (type $16 (func (result i32)))
 (type $17 (func (param i32 f32 f32 f32 i32) (result i32)))
 (type $18 (func (param i32 i32 i32) (result i32)))
 (type $19 (func (param i32 f32 f32 f32 f32 f32 f32)))
 (type $20 (func (param f32 f32 f32) (result f32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/fromSpace (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/total (mut i32) (i32.const 0))
 (global $wasm/game_math/batBaseY (mut i32) (i32.const 0))
 (global $wasm/game_math/batPhase (mut i32) (i32.const 0))
 (global $wasm/game_math/batAmp (mut i32) (i32.const 0))
 (global $wasm/game_math/batOutY (mut i32) (i32.const 0))
 (global $wasm/game_math/batX (mut i32) (i32.const 0))
 (global $wasm/game_math/batDir (mut i32) (i32.const 0))
 (global $wasm/game_math/enemyX (mut i32) (i32.const 0))
 (global $wasm/game_math/enemyY (mut i32) (i32.const 0))
 (global $wasm/game_math/enemyTop (mut i32) (i32.const 0))
 (global $wasm/game_math/distSq (mut i32) (i32.const 0))
 (global $wasm/game_math/contactFlags (mut i32) (i32.const 0))
 (global $wasm/game_math/cloudX (mut i32) (i32.const 0))
 (global $wasm/game_math/cloudScale (mut i32) (i32.const 0))
 (global $wasm/game_math/decorX (mut i32) (i32.const 0))
 (global $wasm/game_math/rngState (mut i32) (i32.const 1))
 (global $~lib/math/rempio2f_y (mut f64) (f64.const 0))
 (memory $0 1)
 (data $0 (i32.const 1036) ",")
 (data $0.1 (i32.const 1048) "\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data $1 (i32.const 1084) "<")
 (data $1.1 (i32.const 1096) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00s\00t\00a\00t\00i\00c\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $2 (i32.const 1148) "<")
 (data $2.1 (i32.const 1160) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $3 (i32.const 1212) "<")
 (data $3.1 (i32.const 1224) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00c\00m\00s\00.\00t\00s")
 (data $4 (i32.const 1276) "<")
 (data $4.1 (i32.const 1288) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00l\00s\00f\00.\00t\00s")
 (data $6 (i32.const 1368) ")\15DNn\83\f9\a2\c0\dd4\f5\d1W\'\fcA\90C<\99\95b\dba\c5\bb\de\abcQ\fe")
 (export "rngSeed" (func $wasm/game_math/rngSeed))
 (export "rngNext" (func $wasm/game_math/rngNext))
 (export "rngRange" (func $wasm/game_math/rngRange))
 (export "setBat" (func $wasm/game_math/setBat))
 (export "getBatX" (func $wasm/game_math/getBatX))
 (export "getBatY" (func $wasm/game_math/getBatY))
 (export "setBatDir" (func $wasm/game_math/setBatDir))
 (export "updateBats" (func $wasm/game_math/updateBats))
 (export "setEnemy" (func $wasm/game_math/setEnemy))
 (export "getContactFlag" (func $wasm/game_math/getContactFlag))
 (export "getDistSq" (func $wasm/game_math/getDistSq))
 (export "classifyContacts" (func $wasm/game_math/classifyContacts))
 (export "setCloud" (func $wasm/game_math/setCloud))
 (export "getCloudX" (func $wasm/game_math/getCloudX))
 (export "driftClouds" (func $wasm/game_math/driftClouds))
 (export "computeStars" (func $wasm/game_math/computeStars))
 (export "fillDecorX" (func $wasm/game_math/fillDecorX))
 (export "getDecorX" (func $wasm/game_math/getDecorX))
 (export "clampf" (func $wasm/game_math/clampf))
 (export "maxEntities" (func $wasm/game_math/maxEntities))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/staticarray/StaticArray<f32>#constructor (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.const 268435455
  i32.gt_u
  if
   i32.const 1056
   i32.const 1104
   i32.const 51
   i32.const 60
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 2
  i32.shl
  local.tee $0
  i32.const 4
  call $~lib/rt/tcms/__new
  local.tee $1
  i32.const 0
  local.get $0
  memory.fill
  local.get $1
 )
 (func $~lib/rt/tlsf/removeBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  i32.load
  local.tee $3
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1296
   i32.const 268
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const -4
  i32.and
  local.tee $3
  i32.const 12
  i32.lt_u
  if
   i32.const 0
   i32.const 1296
   i32.const 270
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $3
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $3
   local.get $3
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $3
   i32.clz
   i32.sub
   local.tee $4
   i32.const 7
   i32.sub
   local.set $2
   local.get $3
   local.get $4
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $3
  i32.const 16
  i32.lt_u
  local.get $2
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1296
   i32.const 284
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load offset=8
  local.set $5
  local.get $1
  i32.load offset=4
  local.tee $4
  if
   local.get $4
   local.get $5
   i32.store offset=8
  end
  local.get $5
  if
   local.get $5
   local.get $4
   i32.store offset=4
  end
  local.get $1
  local.get $0
  local.get $2
  i32.const 4
  i32.shl
  local.get $3
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.tee $1
  i32.load offset=96
  i32.eq
  if
   local.get $1
   local.get $5
   i32.store offset=96
   local.get $5
   i32.eqz
   if
    local.get $0
    local.get $2
    i32.const 2
    i32.shl
    i32.add
    local.tee $1
    i32.load offset=4
    i32.const -2
    local.get $3
    i32.rotl
    i32.and
    local.set $3
    local.get $1
    local.get $3
    i32.store offset=4
    local.get $3
    i32.eqz
    if
     local.get $0
     local.get $0
     i32.load
     i32.const -2
     local.get $2
     i32.rotl
     i32.and
     i32.store
    end
   end
  end
 )
 (func $~lib/rt/tlsf/searchBlock (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  i32.const 256
  i32.lt_u
  if
   local.get $1
   i32.const 4
   i32.shr_u
   local.set $1
  else
   local.get $1
   i32.const 536870910
   i32.lt_u
   if
    local.get $1
    i32.const 1
    i32.const 27
    local.get $1
    i32.clz
    i32.sub
    i32.shl
    i32.add
    i32.const 1
    i32.sub
    local.set $1
   end
   local.get $1
   i32.const 31
   local.get $1
   i32.clz
   i32.sub
   local.tee $2
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
   local.set $1
   local.get $2
   i32.const 7
   i32.sub
   local.set $2
  end
  local.get $1
  i32.const 16
  i32.lt_u
  local.get $2
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1296
   i32.const 334
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=4
  i32.const -1
  local.get $1
  i32.shl
  i32.and
  local.tee $1
  if (result i32)
   local.get $0
   local.get $1
   i32.ctz
   local.get $2
   i32.const 4
   i32.shl
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=96
  else
   local.get $0
   i32.load
   i32.const -1
   local.get $2
   i32.const 1
   i32.add
   i32.shl
   i32.and
   local.tee $1
   if (result i32)
    local.get $0
    local.get $1
    i32.ctz
    local.tee $1
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=4
    local.tee $2
    i32.eqz
    if
     i32.const 0
     i32.const 1296
     i32.const 347
     i32.const 18
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    local.get $2
    i32.ctz
    local.get $1
    i32.const 4
    i32.shl
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=96
   else
    i32.const 0
   end
  end
 )
 (func $~lib/rt/tlsf/insertBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $1
  i32.eqz
  if
   i32.const 0
   i32.const 1296
   i32.const 201
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load
  local.tee $3
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1296
   i32.const 203
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 4
  i32.add
  local.get $1
  i32.load
  i32.const -4
  i32.and
  i32.add
  local.tee $4
  i32.load
  local.tee $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $4
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $3
   i32.const 4
   i32.add
   local.get $2
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store
   local.get $1
   i32.const 4
   i32.add
   local.get $1
   i32.load
   i32.const -4
   i32.and
   i32.add
   local.tee $4
   i32.load
   local.set $2
  end
  local.get $3
  i32.const 2
  i32.and
  if
   local.get $1
   i32.const 4
   i32.sub
   i32.load
   local.tee $1
   i32.load
   local.tee $6
   i32.const 1
   i32.and
   i32.eqz
   if
    i32.const 0
    i32.const 1296
    i32.const 221
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $6
   i32.const 4
   i32.add
   local.get $3
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store
  end
  local.get $4
  local.get $2
  i32.const 2
  i32.or
  i32.store
  local.get $3
  i32.const -4
  i32.and
  local.tee $2
  i32.const 12
  i32.lt_u
  if
   i32.const 0
   i32.const 1296
   i32.const 233
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $1
  i32.const 4
  i32.add
  local.get $2
  i32.add
  i32.ne
  if
   i32.const 0
   i32.const 1296
   i32.const 234
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  i32.const 4
  i32.sub
  local.get $1
  i32.store
  local.get $2
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $2
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $2
   local.get $2
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $2
   i32.clz
   i32.sub
   local.tee $3
   i32.const 7
   i32.sub
   local.set $5
   local.get $2
   local.get $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $2
  i32.const 16
  i32.lt_u
  local.get $5
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1296
   i32.const 251
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=96
  local.set $3
  local.get $1
  i32.const 0
  i32.store offset=4
  local.get $1
  local.get $3
  i32.store offset=8
  local.get $3
  if
   local.get $3
   local.get $1
   i32.store offset=4
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store offset=96
  local.get $0
  local.get $0
  i32.load
  i32.const 1
  local.get $5
  i32.shl
  i32.or
  i32.store
  local.get $0
  local.get $5
  i32.const 2
  i32.shl
  i32.add
  local.tee $0
  local.get $0
  i32.load offset=4
  i32.const 1
  local.get $2
  i32.shl
  i32.or
  i32.store offset=4
 )
 (func $~lib/rt/tlsf/addMemory (param $0 i32) (param $1 i32) (param $2 i64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $2
  local.get $1
  i64.extend_i32_u
  i64.lt_u
  if
   i32.const 0
   i32.const 1296
   i32.const 382
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.set $1
  local.get $0
  i32.load offset=1568
  local.tee $3
  if
   local.get $3
   i32.const 4
   i32.add
   local.get $1
   i32.gt_u
   if
    i32.const 0
    i32.const 1296
    i32.const 389
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $3
   local.get $1
   i32.const 16
   i32.sub
   local.tee $5
   i32.eq
   if
    local.get $3
    i32.load
    local.set $4
    local.get $5
    local.set $1
   end
  else
   local.get $0
   i32.const 1572
   i32.add
   local.get $1
   i32.gt_u
   if
    i32.const 0
    i32.const 1296
    i32.const 402
    i32.const 5
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $2
  i32.wrap_i64
  i32.const -16
  i32.and
  local.get $1
  i32.sub
  local.tee $3
  i32.const 20
  i32.lt_u
  if
   return
  end
  local.get $1
  local.get $4
  i32.const 2
  i32.and
  local.get $3
  i32.const 8
  i32.sub
  local.tee $3
  i32.const 1
  i32.or
  i32.or
  i32.store
  local.get $1
  i32.const 0
  i32.store offset=4
  local.get $1
  i32.const 0
  i32.store offset=8
  local.get $1
  i32.const 4
  i32.add
  local.get $3
  i32.add
  local.tee $3
  i32.const 2
  i32.store
  local.get $0
  local.get $3
  i32.store offset=1568
  local.get $0
  local.get $1
  call $~lib/rt/tlsf/insertBlock
 )
 (func $~lib/rt/tcms/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  i32.const 1073741804
  i32.gt_u
  if
   i32.const 1168
   i32.const 1232
   i32.const 125
   i32.const 30
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   memory.size
   local.tee $2
   i32.const 0
   i32.le_s
   if (result i32)
    i32.const 1
    local.get $2
    i32.sub
    memory.grow
    i32.const 0
    i32.lt_s
   else
    i32.const 0
   end
   if
    unreachable
   end
   i32.const 1408
   i32.const 0
   i32.store
   i32.const 2976
   i32.const 0
   i32.store
   loop $for-loop|0
    local.get $3
    i32.const 23
    i32.lt_u
    if
     local.get $3
     i32.const 2
     i32.shl
     i32.const 1408
     i32.add
     i32.const 0
     i32.store offset=4
     i32.const 0
     local.set $2
     loop $for-loop|1
      local.get $2
      i32.const 16
      i32.lt_u
      if
       local.get $3
       i32.const 4
       i32.shl
       local.get $2
       i32.add
       i32.const 2
       i32.shl
       i32.const 1408
       i32.add
       i32.const 0
       i32.store offset=96
       local.get $2
       i32.const 1
       i32.add
       local.set $2
       br $for-loop|1
      end
     end
     local.get $3
     i32.const 1
     i32.add
     local.set $3
     br $for-loop|0
    end
   end
   i32.const 1408
   i32.const 2980
   memory.size
   i64.extend_i32_s
   i64.const 16
   i64.shl
   call $~lib/rt/tlsf/addMemory
   i32.const 1408
   global.set $~lib/rt/tlsf/ROOT
  end
  global.get $~lib/rt/tlsf/ROOT
  local.set $4
  local.get $0
  i32.const 16
  i32.add
  local.tee $2
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1168
   i32.const 1296
   i32.const 461
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $2
  i32.const 12
  i32.le_u
  if (result i32)
   i32.const 12
  else
   local.get $2
   i32.const 19
   i32.add
   i32.const -16
   i32.and
   i32.const 4
   i32.sub
  end
  local.tee $5
  call $~lib/rt/tlsf/searchBlock
  local.tee $2
  i32.eqz
  if
   local.get $5
   i32.const 256
   i32.ge_u
   if (result i32)
    local.get $5
    i32.const 536870910
    i32.lt_u
    if (result i32)
     local.get $5
     i32.const 1
     i32.const 27
     local.get $5
     i32.clz
     i32.sub
     i32.shl
     i32.add
     i32.const 1
     i32.sub
    else
     local.get $5
    end
   else
    local.get $5
   end
   i32.const 4
   local.get $4
   i32.load offset=1568
   memory.size
   local.tee $2
   i32.const 16
   i32.shl
   i32.const 4
   i32.sub
   i32.ne
   i32.shl
   i32.add
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.set $3
   local.get $2
   local.get $3
   local.get $2
   local.get $3
   i32.gt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $3
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
   local.get $4
   local.get $2
   i32.const 16
   i32.shl
   memory.size
   i64.extend_i32_s
   i64.const 16
   i64.shl
   call $~lib/rt/tlsf/addMemory
   local.get $4
   local.get $5
   call $~lib/rt/tlsf/searchBlock
   local.tee $2
   i32.eqz
   if
    i32.const 0
    i32.const 1296
    i32.const 499
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $5
  local.get $2
  i32.load
  i32.const -4
  i32.and
  i32.gt_u
  if
   i32.const 0
   i32.const 1296
   i32.const 501
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $2
  call $~lib/rt/tlsf/removeBlock
  local.get $2
  i32.load
  local.set $6
  local.get $5
  i32.const 4
  i32.add
  i32.const 15
  i32.and
  if
   i32.const 0
   i32.const 1296
   i32.const 361
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $6
  i32.const -4
  i32.and
  local.get $5
  i32.sub
  local.tee $3
  i32.const 16
  i32.ge_u
  if
   local.get $2
   local.get $5
   local.get $6
   i32.const 2
   i32.and
   i32.or
   i32.store
   local.get $2
   i32.const 4
   i32.add
   local.get $5
   i32.add
   local.tee $5
   local.get $3
   i32.const 4
   i32.sub
   i32.const 1
   i32.or
   i32.store
   local.get $4
   local.get $5
   call $~lib/rt/tlsf/insertBlock
  else
   local.get $2
   local.get $6
   i32.const -2
   i32.and
   i32.store
   local.get $2
   i32.const 4
   i32.add
   local.get $2
   i32.load
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   local.get $3
   i32.load
   i32.const -3
   i32.and
   i32.store
  end
  local.get $2
  local.get $1
  i32.store offset=12
  local.get $2
  local.get $0
  i32.store offset=16
  global.get $~lib/rt/tcms/fromSpace
  local.tee $0
  i32.load offset=8
  local.set $1
  local.get $2
  local.get $0
  i32.store offset=4
  local.get $2
  local.get $1
  i32.store offset=8
  local.get $1
  local.get $2
  local.get $1
  i32.load offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store offset=4
  local.get $0
  local.get $2
  i32.store offset=8
  global.get $~lib/rt/tcms/total
  local.get $2
  i32.load
  i32.const -4
  i32.and
  i32.const 4
  i32.add
  i32.add
  global.set $~lib/rt/tcms/total
  local.get $2
  i32.const 20
  i32.add
 )
 (func $~start
  (local $0 i32)
  i32.const 1348
  i32.const 1344
  i32.store
  i32.const 1352
  i32.const 1344
  i32.store
  i32.const 1344
  global.set $~lib/rt/tcms/fromSpace
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/batBaseY
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/batPhase
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/batAmp
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/batOutY
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/batX
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/batDir
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/enemyX
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/enemyY
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/enemyTop
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/distSq
  i32.const 256
  i32.const 5
  call $~lib/rt/tcms/__new
  local.tee $0
  i32.const 0
  i32.const 256
  memory.fill
  local.get $0
  global.set $wasm/game_math/contactFlags
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/cloudX
  i32.const 64
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/cloudScale
  i32.const 256
  call $~lib/staticarray/StaticArray<f32>#constructor
  global.set $wasm/game_math/decorX
 )
 (func $~lib/math/NativeMathf.sin (param $0 f32) (result f32)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 f64)
  (local $5 i64)
  (local $6 i32)
  (local $7 i32)
  (local $8 i64)
  (local $9 i64)
  local.get $0
  i32.reinterpret_f32
  local.tee $3
  i32.const 31
  i32.shr_u
  local.set $6
  block $folding-inner0
   local.get $3
   i32.const 2147483647
   i32.and
   local.tee $3
   i32.const 1061752794
   i32.le_u
   if
    local.get $3
    i32.const 964689920
    i32.lt_u
    if
     local.get $0
     return
    end
    local.get $0
    f64.promote_f32
    local.tee $2
    local.get $2
    f64.mul
    local.tee $1
    local.get $2
    f64.mul
    local.set $4
    br $folding-inner0
   end
   local.get $3
   i32.const 1081824209
   i32.le_u
   if
    local.get $3
    i32.const 1075235811
    i32.le_u
    if
     local.get $6
     if (result f32)
      local.get $0
      f64.promote_f32
      f64.const 1.5707963267948966
      f64.add
      local.tee $1
      local.get $1
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $2
      local.get $1
      f64.const -0.499999997251031
      f64.mul
      f64.const 1
      f64.add
      local.get $2
      f64.const 0.04166662332373906
      f64.mul
      f64.add
      local.get $2
      local.get $1
      f64.mul
      local.get $1
      f64.const 2.439044879627741e-05
      f64.mul
      f64.const -0.001388676377460993
      f64.add
      f64.mul
      f64.add
      f32.demote_f64
      f32.neg
     else
      local.get $0
      f64.promote_f32
      f64.const -1.5707963267948966
      f64.add
      local.tee $1
      local.get $1
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $2
      local.get $1
      f64.const -0.499999997251031
      f64.mul
      f64.const 1
      f64.add
      local.get $2
      f64.const 0.04166662332373906
      f64.mul
      f64.add
      local.get $2
      local.get $1
      f64.mul
      local.get $1
      f64.const 2.439044879627741e-05
      f64.mul
      f64.const -0.001388676377460993
      f64.add
      f64.mul
      f64.add
      f32.demote_f64
     end
     return
    end
    local.get $0
    f64.promote_f32
    local.tee $1
    f64.const 3.141592653589793
    f64.add
    local.get $1
    f64.const -3.141592653589793
    f64.add
    local.get $6
    select
    f64.neg
    local.tee $2
    local.get $2
    f64.mul
    local.tee $1
    local.get $2
    f64.mul
    local.set $4
    br $folding-inner0
   end
   local.get $3
   i32.const 1088565717
   i32.le_u
   if
    local.get $3
    i32.const 1085271519
    i32.le_u
    if
     local.get $6
     if (result f32)
      local.get $0
      f64.promote_f32
      f64.const 4.71238898038469
      f64.add
      local.tee $1
      local.get $1
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $2
      local.get $1
      f64.const -0.499999997251031
      f64.mul
      f64.const 1
      f64.add
      local.get $2
      f64.const 0.04166662332373906
      f64.mul
      f64.add
      local.get $2
      local.get $1
      f64.mul
      local.get $1
      f64.const 2.439044879627741e-05
      f64.mul
      f64.const -0.001388676377460993
      f64.add
      f64.mul
      f64.add
      f32.demote_f64
     else
      local.get $0
      f64.promote_f32
      f64.const -4.71238898038469
      f64.add
      local.tee $1
      local.get $1
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $2
      local.get $1
      f64.const -0.499999997251031
      f64.mul
      f64.const 1
      f64.add
      local.get $2
      f64.const 0.04166662332373906
      f64.mul
      f64.add
      local.get $2
      local.get $1
      f64.mul
      local.get $1
      f64.const 2.439044879627741e-05
      f64.mul
      f64.const -0.001388676377460993
      f64.add
      f64.mul
      f64.add
      f32.demote_f64
      f32.neg
     end
     return
    end
    local.get $0
    f64.promote_f32
    local.tee $1
    f64.const 6.283185307179586
    f64.add
    local.get $1
    f64.const -6.283185307179586
    f64.add
    local.get $6
    select
    local.tee $2
    local.get $2
    f64.mul
    local.tee $1
    local.get $2
    f64.mul
    local.set $4
    br $folding-inner0
   end
   local.get $3
   i32.const 2139095040
   i32.ge_u
   if
    local.get $0
    local.get $0
    f32.sub
    return
   end
   block $~lib/math/rempio2f|inlined.0 (result i32)
    local.get $3
    i32.const 1305022427
    i32.lt_u
    if
     local.get $0
     f64.promote_f32
     local.tee $1
     f64.const 0.6366197723675814
     f64.mul
     f64.nearest
     local.set $2
     local.get $1
     local.get $2
     f64.const 1.5707963109016418
     f64.mul
     f64.sub
     local.get $2
     f64.const 1.5893254773528196e-08
     f64.mul
     f64.sub
     global.set $~lib/math/rempio2f_y
     local.get $2
     i32.trunc_sat_f64_s
     br $~lib/math/rempio2f|inlined.0
    end
    local.get $3
    i32.const 23
    i32.shr_s
    i32.const 152
    i32.sub
    local.tee $7
    i32.const 63
    i32.and
    i64.extend_i32_s
    local.set $8
    local.get $7
    i32.const 6
    i32.shr_s
    i32.const 3
    i32.shl
    i32.const 1368
    i32.add
    local.tee $7
    i64.load offset=8
    local.set $5
    f64.const 8.515303950216386e-20
    local.get $0
    f64.promote_f32
    f64.copysign
    local.get $3
    i32.const 8388607
    i32.and
    i32.const 8388608
    i32.or
    i64.extend_i32_s
    local.tee $9
    local.get $7
    i64.load
    local.get $8
    i64.shl
    local.get $5
    i64.const 64
    local.get $8
    i64.sub
    i64.shr_u
    i64.or
    i64.mul
    local.get $8
    i64.const 32
    i64.gt_u
    if (result i64)
     local.get $5
     local.get $8
     i64.const 32
     i64.sub
     i64.shl
     local.get $7
     i64.load offset=16
     i64.const 96
     local.get $8
     i64.sub
     i64.shr_u
     i64.or
    else
     local.get $5
     i64.const 32
     local.get $8
     i64.sub
     i64.shr_u
    end
    local.get $9
    i64.mul
    i64.const 32
    i64.shr_u
    i64.add
    local.tee $5
    i64.const 2
    i64.shl
    local.tee $8
    f64.convert_i64_s
    f64.mul
    global.set $~lib/math/rempio2f_y
    i32.const 0
    local.get $5
    i64.const 62
    i64.shr_u
    local.get $8
    i64.const 63
    i64.shr_u
    i64.add
    i32.wrap_i64
    local.tee $3
    i32.sub
    local.get $3
    local.get $6
    select
   end
   local.set $3
   global.get $~lib/math/rempio2f_y
   local.set $1
   local.get $3
   i32.const 1
   i32.and
   if (result f32)
    local.get $1
    local.get $1
    f64.mul
    local.tee $1
    local.get $1
    f64.mul
    local.set $2
    local.get $1
    f64.const -0.499999997251031
    f64.mul
    f64.const 1
    f64.add
    local.get $2
    f64.const 0.04166662332373906
    f64.mul
    f64.add
    local.get $2
    local.get $1
    f64.mul
    local.get $1
    f64.const 2.439044879627741e-05
    f64.mul
    f64.const -0.001388676377460993
    f64.add
    f64.mul
    f64.add
    f32.demote_f64
   else
    local.get $1
    local.get $1
    local.get $1
    f64.mul
    local.tee $2
    local.get $1
    f64.mul
    local.tee $1
    local.get $2
    f64.const 0.008333329385889463
    f64.mul
    f64.const -0.16666666641626524
    f64.add
    f64.mul
    f64.add
    local.get $1
    local.get $2
    local.get $2
    f64.mul
    f64.mul
    local.get $2
    f64.const 2.718311493989822e-06
    f64.mul
    f64.const -1.9839334836096632e-04
    f64.add
    f64.mul
    f64.add
    f32.demote_f64
   end
   local.tee $0
   f32.neg
   local.get $0
   local.get $3
   i32.const 2
   i32.and
   select
   return
  end
  local.get $2
  local.get $4
  local.get $1
  f64.const 0.008333329385889463
  f64.mul
  f64.const -0.16666666641626524
  f64.add
  f64.mul
  f64.add
  local.get $4
  local.get $1
  local.get $1
  f64.mul
  f64.mul
  local.get $1
  f64.const 2.718311493989822e-06
  f64.mul
  f64.const -1.9839334836096632e-04
  f64.add
  f64.mul
  f64.add
  f32.demote_f64
 )
 (func $wasm/game_math/updateBats (param $0 i32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 f32)
  (local $5 i32)
  (local $6 f32)
  (local $7 i32)
  (local $8 f32)
  i32.const 64
  local.get $0
  local.get $0
  i32.const 64
  i32.ge_s
  select
  local.set $5
  local.get $4
  f32.const 1e3
  f32.div
  local.set $6
  i32.const 0
  local.set $0
  loop $for-loop|0
   local.get $0
   local.get $5
   i32.lt_s
   if
    local.get $0
    i32.const 2
    i32.shl
    local.tee $7
    global.get $wasm/game_math/batAmp
    i32.add
    f32.load
    local.set $8
    global.get $wasm/game_math/batDir
    local.get $7
    i32.add
    f32.load
    local.set $4
    global.get $wasm/game_math/batOutY
    local.get $7
    i32.add
    global.get $wasm/game_math/batBaseY
    local.get $7
    i32.add
    f32.load
    local.get $1
    local.get $3
    f32.mul
    global.get $wasm/game_math/batPhase
    local.get $7
    i32.add
    f32.load
    f32.add
    call $~lib/math/NativeMathf.sin
    local.get $8
    f32.mul
    f32.add
    f32.store
    global.get $wasm/game_math/batX
    local.get $7
    i32.add
    local.tee $7
    local.get $7
    f32.load
    local.get $4
    local.get $2
    f32.mul
    local.get $6
    f32.mul
    f32.add
    f32.store
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
 )
 (func $wasm/game_math/setEnemy (param $0 i32) (param $1 f32) (param $2 f32) (param $3 f32)
  local.get $0
  i32.const 0
  i32.lt_s
  local.get $0
  i32.const 64
  i32.ge_s
  i32.or
  if
   return
  end
  local.get $0
  i32.const 2
  i32.shl
  local.tee $0
  global.get $wasm/game_math/enemyX
  i32.add
  local.get $1
  f32.store
  global.get $wasm/game_math/enemyY
  local.get $0
  i32.add
  local.get $2
  f32.store
  global.get $wasm/game_math/enemyTop
  local.get $0
  i32.add
  local.get $3
  f32.store
 )
 (func $wasm/game_math/setCloud (param $0 i32) (param $1 f32) (param $2 f32)
  local.get $0
  i32.const 0
  i32.lt_s
  local.get $0
  i32.const 64
  i32.ge_s
  i32.or
  if
   return
  end
  local.get $0
  i32.const 2
  i32.shl
  local.tee $0
  global.get $wasm/game_math/cloudX
  i32.add
  local.get $1
  f32.store
  global.get $wasm/game_math/cloudScale
  local.get $0
  i32.add
  local.get $2
  f32.store
 )
 (func $wasm/game_math/setBatDir (param $0 i32) (param $1 f32)
  local.get $0
  i32.const 0
  i32.lt_s
  local.get $0
  i32.const 64
  i32.ge_s
  i32.or
  if
   return
  end
  global.get $wasm/game_math/batDir
  local.get $0
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  f32.store
 )
 (func $wasm/game_math/setBat (param $0 i32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 f32) (param $5 f32)
  local.get $0
  i32.const 0
  i32.lt_s
  local.get $0
  i32.const 64
  i32.ge_s
  i32.or
  if
   return
  end
  local.get $0
  i32.const 2
  i32.shl
  local.tee $0
  global.get $wasm/game_math/batBaseY
  i32.add
  local.get $1
  f32.store
  global.get $wasm/game_math/batPhase
  local.get $0
  i32.add
  local.get $2
  f32.store
  global.get $wasm/game_math/batAmp
  local.get $0
  i32.add
  local.get $3
  f32.store
  global.get $wasm/game_math/batX
  local.get $0
  i32.add
  local.get $4
  f32.store
  global.get $wasm/game_math/batDir
  local.get $0
  i32.add
  local.get $5
  f32.store
 )
 (func $wasm/game_math/rngSeed (param $0 i32)
  local.get $0
  i32.const 1
  local.get $0
  select
  global.set $wasm/game_math/rngState
 )
 (func $wasm/game_math/rngRange (param $0 f32) (param $1 f32) (result f32)
  (local $2 i32)
  global.get $wasm/game_math/rngState
  local.tee $2
  i32.const 13
  i32.shl
  local.get $2
  i32.xor
  local.tee $2
  i32.const 17
  i32.shr_u
  local.get $2
  i32.xor
  local.tee $2
  i32.const 5
  i32.shl
  local.get $2
  i32.xor
  local.tee $2
  global.set $wasm/game_math/rngState
  local.get $0
  local.get $2
  f32.convert_i32_u
  f32.const 2.3283064365386963e-10
  f32.mul
  local.get $1
  local.get $0
  f32.sub
  f32.mul
  f32.add
 )
 (func $wasm/game_math/rngNext (result f32)
  (local $0 i32)
  global.get $wasm/game_math/rngState
  local.tee $0
  i32.const 13
  i32.shl
  local.get $0
  i32.xor
  local.tee $0
  i32.const 17
  i32.shr_u
  local.get $0
  i32.xor
  local.tee $0
  i32.const 5
  i32.shl
  local.get $0
  i32.xor
  local.tee $0
  global.set $wasm/game_math/rngState
  local.get $0
  f32.convert_i32_u
  f32.const 2.3283064365386963e-10
  f32.mul
 )
 (func $wasm/game_math/maxEntities (result i32)
  i32.const 64
 )
 (func $wasm/game_math/getDistSq (param $0 i32) (result f32)
  global.get $wasm/game_math/distSq
  local.get $0
  i32.const 2
  i32.shl
  i32.add
  f32.load
 )
 (func $wasm/game_math/getDecorX (param $0 i32) (result f32)
  global.get $wasm/game_math/decorX
  local.get $0
  i32.const 2
  i32.shl
  i32.add
  f32.load
 )
 (func $wasm/game_math/getContactFlag (param $0 i32) (result i32)
  global.get $wasm/game_math/contactFlags
  local.get $0
  i32.const 2
  i32.shl
  i32.add
  i32.load
 )
 (func $wasm/game_math/getCloudX (param $0 i32) (result f32)
  global.get $wasm/game_math/cloudX
  local.get $0
  i32.const 2
  i32.shl
  i32.add
  f32.load
 )
 (func $wasm/game_math/getBatY (param $0 i32) (result f32)
  global.get $wasm/game_math/batOutY
  local.get $0
  i32.const 2
  i32.shl
  i32.add
  f32.load
 )
 (func $wasm/game_math/getBatX (param $0 i32) (result f32)
  global.get $wasm/game_math/batX
  local.get $0
  i32.const 2
  i32.shl
  i32.add
  f32.load
 )
 (func $wasm/game_math/fillDecorX (param $0 i32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 i32) (result i32)
  (local $5 i32)
  local.get $4
  i32.const 1
  local.get $4
  select
  global.set $wasm/game_math/rngState
  i32.const 256
  local.get $0
  local.get $0
  i32.const 256
  i32.ge_s
  select
  local.set $0
  loop $while-continue|0
   local.get $0
   local.get $5
   i32.gt_s
   local.get $1
   local.get $2
   f32.lt
   i32.and
   if
    global.get $wasm/game_math/decorX
    local.get $5
    i32.const 2
    i32.shl
    i32.add
    local.get $1
    f32.store
    global.get $wasm/game_math/rngState
    local.tee $4
    i32.const 13
    i32.shl
    local.get $4
    i32.xor
    local.tee $4
    i32.const 17
    i32.shr_u
    local.get $4
    i32.xor
    local.tee $4
    i32.const 5
    i32.shl
    local.get $4
    i32.xor
    local.tee $4
    global.set $wasm/game_math/rngState
    local.get $1
    local.get $3
    local.get $4
    f32.convert_i32_u
    f32.const 2.3283064365386963e-10
    f32.mul
    local.get $3
    f32.mul
    f32.const 0.550000011920929
    f32.mul
    f32.add
    f32.add
    local.set $1
    local.get $5
    i32.const 1
    i32.add
    local.set $5
    br $while-continue|0
   end
  end
  local.get $5
 )
 (func $wasm/game_math/driftClouds (param $0 i32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 f32)
  (local $5 f32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  i32.const 64
  local.get $0
  local.get $0
  i32.const 64
  i32.ge_s
  select
  local.set $6
  i32.const 0
  local.set $0
  loop $for-loop|0
   local.get $0
   local.get $6
   i32.lt_s
   if
    local.get $0
    i32.const 2
    i32.shl
    local.tee $7
    global.get $wasm/game_math/cloudX
    i32.add
    local.tee $8
    f32.load
    local.get $2
    local.get $1
    f32.mul
    global.get $wasm/game_math/cloudScale
    local.get $7
    i32.add
    f32.load
    f32.mul
    f32.add
    local.set $5
    local.get $8
    local.get $3
    local.get $5
    local.get $4
    local.get $5
    f32.lt
    select
    f32.store
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
 )
 (func $wasm/game_math/computeStars (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  i32.const 2
  i32.const 1
  local.get $1
  i32.const 0
  i32.le_s
  local.get $0
  local.get $1
  i32.ge_s
  i32.or
  select
  local.tee $0
  i32.const 1
  i32.add
  local.get $0
  local.get $2
  select
 )
 (func $wasm/game_math/classifyContacts (param $0 i32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 f32) (param $5 f32) (param $6 f32)
  (local $7 i32)
  (local $8 i32)
  (local $9 f32)
  i32.const 64
  local.get $0
  local.get $0
  i32.const 64
  i32.ge_s
  select
  local.set $8
  local.get $5
  local.get $5
  f32.mul
  local.set $5
  i32.const 0
  local.set $0
  loop $for-loop|0
   local.get $0
   local.get $8
   i32.lt_s
   if
    local.get $0
    i32.const 2
    i32.shl
    local.tee $7
    global.get $wasm/game_math/enemyX
    i32.add
    f32.load
    local.get $1
    f32.sub
    local.set $9
    global.get $wasm/game_math/distSq
    local.get $7
    i32.add
    local.get $9
    local.get $9
    f32.mul
    global.get $wasm/game_math/enemyY
    local.get $7
    i32.add
    f32.load
    local.get $2
    f32.sub
    local.tee $9
    local.get $9
    f32.mul
    f32.add
    local.tee $9
    f32.store
    global.get $wasm/game_math/contactFlags
    local.get $7
    i32.add
    local.get $5
    local.get $9
    f32.ge
    if (result i32)
     i32.const 1
     i32.const 2
     local.get $3
     global.get $wasm/game_math/enemyTop
     local.get $7
     i32.add
     f32.load
     local.get $6
     f32.add
     f32.le
     local.get $4
     f32.const 0
     f32.gt
     i32.and
     select
    else
     i32.const 0
    end
    i32.store
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
 )
 (func $wasm/game_math/clampf (param $0 f32) (param $1 f32) (param $2 f32) (result f32)
  local.get $0
  local.get $1
  f32.lt
  if
   local.get $1
   return
  end
  local.get $0
  local.get $2
  f32.gt
  if
   local.get $2
   return
  end
  local.get $0
 )
)
