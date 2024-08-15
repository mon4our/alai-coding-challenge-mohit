
import {
  Circle2d,
	Group2d,
	Polyline2d,
	RecordPropsType,
	ShapeUtil,
	T,
	TLBaseShape,
	Tldraw,
	Vec,
} from 'tldraw'
import 'tldraw/tldraw.css'

const tlShapeProps = {
	len: T.number,
	parts: T.number,
}

type TlShapeProps = RecordPropsType<typeof tlShapeProps>
type TlShape = TLBaseShape<'tl', TlShapeProps>
// @ts-expect-error ignoring class error below
class TlShapeUtil extends ShapeUtil<TlShape> {
	static override type = 'tl' as const
	static override props = tlShapeProps

  override canResize= () =>false
  override canEdit = () =>false

	override getDefaultProps() {
		return {
			len: 500,
			parts: 5,
		}
	}
	//[1]
	override getGeometry(shape: TlShape) {
		const { tl: tlGeometry, arrow: arrowGeometry } = getTlVertices(shape)
		const tlmain = new Polyline2d({
			points: tlGeometry,
		})
		const point = new Circle2d({
			radius: 20,
			isFilled: true,
		})
    const arrow = new Polyline2d({
      points: arrowGeometry,
    })
		const geometry = new Group2d({
			children: [tlmain, point, arrow],
		})
		return geometry
	}
	// [2]
	override component(shape: TlShape) {
    const { tl: tlVertices, arrow: arrowVertices } = getTlVertices(shape)
    const tlPathData = 'M' + tlVertices[0] + 'L' + tlVertices.slice(1) + 'Z'
    
    const arrowPaths = arrowVertices.map((_, i) => {
      if (i % 2 === 0) { // Start of each arrow segment
        return 'M' + arrowVertices[i] + 'L' + arrowVertices[i + 1]
      }
      return ''
    }).join('')
    
    const circles = arrowVertices.filter((_, i) => i % 2 === 0).map((point, i) => {
      const circleX = point.x
      const circleY = point.y
      const circleRadius = 5
      return <circle key={i} cx={circleX} cy={circleY} r={circleRadius} fill="black" />
    })
  
    // Labels for subheadings and descriptions with alternating positions
    const labels = arrowVertices.filter((_, i) => i % 2 === 0).map((point, i) => {
      const isEven = i % 2 === 0
      const subheadingX = point.x
      const subheadingY = point.y + (isEven ? 70 : -100) // Above or below the arrow
      const descriptionY = point.y + (isEven ? 110 : -60) // Closer or farther from the arrow
  
      return (
        <g key={i}>
          <text x={subheadingX} y={subheadingY} textAnchor="middle" fontWeight="bold">Subheading {i + 1}</text>
          <text x={subheadingX} y={descriptionY} textAnchor="middle">Description {i + 1}</text>
        </g>
      )
    })
  
    return (
      <svg className="tl-svg-container">
        <path strokeWidth={3} stroke="black" d={tlPathData + arrowPaths} fill="none" />
        {circles}
        {labels}
      </svg>
    )
  }  
  
}
// [4]
function getTlVertices(shape: TlShape): { tl: Vec[]; arrow: Vec[] } {
	const { len, parts } = shape.props
  const tlstart=100
	const tl = [
		new Vec(tlstart, 200), // Tl start (left)
		new Vec(tlstart+len+100, 200), // Tl end (right) (Added +100 to len so that no. of parts=no. of arrows)
	]
  const arrow = []
	for (let i = 1; i <= parts; i++) {
		const x = tlstart+(i * len) / parts  // Position of the arrow along the x-axis
    const direction= i%2===0?-50:50
		arrow.push(new Vec(x, 200))    // Start point of the arrow (intersection with the main line)
		arrow.push(new Vec(x, 200+direction))    // End point of the arrow (downwards)
	}
	return { tl, arrow }
}

const shapeUtils = [TlShapeUtil]


export default function ShapeWithGeometryExample({parts}:{parts: number}) {
	return (
		<div style={{ position: "fixed", width: "100vw", height: "50vh" }}>
			<Tldraw
      hideUi={true}
				onMount={(editor) => {
					editor.createShape({
						type: 'tl',
						props: {
							len: parts*100,
							parts: parts,
						},
					})
          editor.sideEffects.registerBeforeChangeHandler('shape', (prev, next) => {
						if (
							editor.isShapeOfType<TlShape>(prev, 'tl') &&
							editor.isShapeOfType<TlShape>(next, 'tl')
						) {
							if (
								next.x !== prev.x ||
								next.y !== prev.y ||
								next.rotation !== prev.rotation ||
								next.props.len !== prev.props.len ||
								next.props.parts !== prev.props.parts
							) {
								return prev
							}
            }
						return next
					})
				}}
				shapeUtils={shapeUtils}
			/>
		</div>
	)
}