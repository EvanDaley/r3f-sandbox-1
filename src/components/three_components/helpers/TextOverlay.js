
// 
// TODO: Turn this into something reusable (props, etc). For now its a good reference for displaying vector3s.
// 
export default function TextOverlay() {
  return (
    <>
      <Text
        position={[0, 2, 0]}
        color="white"
        fontSize={2}
        maxWidth={200}
      >
        {JSON.stringify(pos, function (key, val) {
          return val.toFixed ? Number(val.toFixed(3)) : val;
        })}
      </Text>
    </>
  );
}

